import { error, redirect } from '@sveltejs/kit';
import type { Item, Module } from '$lib/server/db/schema/class';
import type { LayoutServerLoad } from './$types';
import { getItemSubmission } from '$lib/server/db/helpers/submission';

export const load: LayoutServerLoad = async ({ locals, params, url, parent }) => {
	if (!params.track_slug || !params.item_slug) {
		error(404, 'Not found');
	}

	const parentData = await parent();

	let module: (Module & { items: Item[] }) | null = null;
	let item: Item | null = null;
	let prevItemIdx: number | null = null;
	let nextItemIdx: number | null = null;

	for (const mod of parentData.modules) {
		for (const [i, it] of mod.items.entries()) {
			if (it.slug === params.item_slug) {
				item = it;
				module = mod;
				if (i >= 1) {
					prevItemIdx = i - 1;
				}
				if (i < mod.items.length - 1) {
					nextItemIdx = i + 1;
				}
				break;
			}
		}
		if (item) break;
	}

	if (!module || !item) {
		error(404, 'Not found');
	}

	const lastPart = url.pathname.split('/').filter(Boolean).pop();

	if (lastPart !== item.type) {
		redirect(308, `/courses/${parentData.track.slug}/${item.slug}/${item.type}`);
	}

	console.log('ORORORORO----------------');
	const submission = locals.user ? await getItemSubmission(locals.user.id, item.id) : null;

	return {
		item,
		module,
		submission,
		prevItemIdx,
		nextItemIdx
	};
};
