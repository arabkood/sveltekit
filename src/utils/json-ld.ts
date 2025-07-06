export function serializeSchema(thing: object) {
	return `<script type="application/ld+json">${JSON.stringify(thing)}</script>`;
}
