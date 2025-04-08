import { z } from 'zod';
import type { ZodObject, ZodRawShape, ZodEffects } from 'zod';

interface FormState<T> {
	values: T;
	errors: Partial<Record<keyof T, string>>;
	touched: Partial<Record<keyof T, boolean>>;
	isSubmitting: boolean;
	isValid: boolean;
}

type SchemaType = ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>;

export { z };

export function createForm<T extends Record<string, unknown>>(
	initialValues: T,
	schema: SchemaType,
	onSubmit: (values: T) => Promise<void> | void
) {
	// Form state
	const state = $state<FormState<T>>({
		values: initialValues,
		errors: {},
		touched: {},
		isSubmitting: false,
		isValid: true
	});

	// Get the base schema without refinements
	const baseSchema = schema instanceof z.ZodEffects ? schema._def.schema : schema;

	// Validate single field
	function validateField(name: keyof T) {
		// First validate against the base schema
		const partial = z.object({
			[name]: (baseSchema.shape as Record<keyof T, unknown>)[name] as z.ZodType<unknown>
		});
		const result = partial.safeParse({ [name]: state.values[name] });

		if (!result.success) {
			state.errors[name] = result.error.errors[0]?.message || 'Invalid value';
			state.isValid = false;
		} else {
			// If base validation passes, check refinements
			const fullResult = schema.safeParse(state.values);
			if (!fullResult.success) {
				const refinementErrors = fullResult.error.errors.filter((error) => {
					// Check if this refinement error affects our field
					return error.path[0] === name;
				});

				if (refinementErrors.length > 0) {
					state.errors[name] = refinementErrors[0].message;
					state.isValid = false;
				} else {
					delete state.errors[name];
					state.isValid = Object.keys(state.errors).length === 0;
				}
			} else {
				delete state.errors[name];
				state.isValid = Object.keys(state.errors).length === 0;
			}
		}
	}

	// Handle input changes
	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const name = target.name as keyof T;
		const value = target.type === 'checkbox' ? target.checked : target.value;

		// Type assertion here since we know the value will match the schema
		state.values[name] = value as T[keyof T];
		state.touched[name] = true;

		// Validate both the changed field and any fields that might be affected by refinements
		validateField(name);

		// Check for related fields in refinements
		const fullResult = schema.safeParse(state.values);
		if (!fullResult.success) {
			fullResult.error.errors.forEach((error) => {
				const affectedField = error.path[0] as keyof T;
				if (affectedField !== name) {
					validateField(affectedField);
				}
			});
		}
	}

	// Handle form submission
	async function handleSubmit(event: Event) {
		event.preventDefault();
		state.isSubmitting = true;

		// Validate all fields including refinements
		const result = schema.safeParse(state.values);
		if (!result.success) {
			state.errors = {};
			result.error.errors.forEach((error) => {
				const path = error.path[0] as keyof T;
				state.errors[path] = error.message;
			});
			state.isValid = false;
			state.isSubmitting = false;
			return;
		}
		state.errors = {};
		state.isValid = true;

		try {
			await onSubmit(state.values);
		} catch (error) {
			console.error('Form submission error:', error);
		} finally {
			state.isSubmitting = false;
		}
	}

	// Reset form
	function reset() {
		state.values = initialValues;
		state.errors = {};
		state.touched = {};
		state.isSubmitting = false;
		state.isValid = true;
	}

	return {
		state,
		handleChange,
		handleSubmit,
		reset
	};
}
