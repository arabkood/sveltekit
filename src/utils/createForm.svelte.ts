import { z, type ZodType } from 'zod';

interface FormState<T> {
	values: T;
	errors: Partial<Record<keyof T, string>>;
	touched: Partial<Record<keyof T, boolean>>;
	isSubmitting: boolean;
	isValid: boolean;
}

type SchemaType<T> = ZodType<T>;

export { z };

export function createForm<T extends Record<string, unknown>>(
	initialValues: T,
	schema: SchemaType<T>,
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

	const baseSchema = schema;

	// Validate single field
	function validateField(name: keyof T) {
		// We still need this type guard because baseSchema is of a general type
		if ('shape' in baseSchema && baseSchema.shape) {
			const partial = z.object({
				[name]: (baseSchema.shape as Record<keyof T, unknown>)[name] as z.ZodType<unknown>
			});
			const result = partial.safeParse({ [name]: state.values[name] });
			if (!result.success) {
				state.errors[name] = result.error.issues[0]?.message || 'Invalid value';
				state.isValid = false;
			} else {
				// If base validation passes, check refinements on the original schema
				const fullResult = schema.safeParse(state.values);
				if (!fullResult.success) {
					const refinementErrors = fullResult.error.issues.filter((issue) => {
						return issue.path[0] === name;
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
	}

	// Handle input changes
	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const name = target.name as keyof T;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		state.values[name] = value as T[keyof T];
		state.touched[name] = true;

		validateField(name);

		const fullResult = schema.safeParse(state.values);
		if (!fullResult.success) {
			fullResult.error.issues.forEach((issue) => {
				const affectedField = issue.path[0] as keyof T;
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

		const result = schema.safeParse(state.values);
		if (!result.success) {
			state.errors = {};
			result.error.issues.forEach((issue) => {
				const path = issue.path[0] as keyof T;
				state.errors[path] = issue.message;
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
