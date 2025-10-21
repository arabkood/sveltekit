type ClassValue = string | null | boolean | undefined | Record<string, boolean>;

export function cn(...inputs: ClassValue[]): string {
	const classes = inputs.filter(Boolean);

	return classes
		.map((cls) => {
			if (typeof cls === 'string') return cls;
			if (typeof cls === 'object') {
				return Object.entries(cls as object)
					.filter(([, value]) => value)
					.map(([key]) => key)
					.join(' ');
			}
			return '';
		})
		.filter(Boolean)
		.filter((v) => typeof v !== "boolean")
		.join(' ');
}
