import type { TranslationKey } from '$types/i18n';

interface HijriDate {
	year: number;
	month: number;
	date: number;
	dayOfWeek: number;
}

const gregorianToHijri = (date: Date): HijriDate => {
	const jd = Math.floor((date.getTime() - Date.UTC(1970, 0, 1)) / (1000 * 60 * 60 * 24)) + 2440588;
	const l = jd - 1948440 + 10632;
	const n = Math.floor((l - 1) / 10631);
	const l1 = l - 10631 * n + 354;
	const j =
		Math.floor((10985 - l1) / 5316) * Math.floor((50 * l1) / 17719) +
		Math.floor(l1 / 5670) * Math.floor((43 * l1) / 15238);
	const l2 =
		l1 -
		Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
		Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
		29;
	const month = Math.floor((24 * l2) / 709);
	const daten = l2 - Math.floor((709 * month) / 24);
	const year = 30 * n + j - 30;

	return { year, month, date: daten, dayOfWeek: new Date(date).getDay() };
};

export const formatDate = (
	date: Date,
	formatStr: string,
	t?: (key: TranslationKey) => string
): string => {
	// Default English values
	const defaultDays = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];
	const defaultMonths = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const defaultHijriMonths = [
		'Muharram',
		'Safar',
		"Rabi' al-Awwal",
		"Rabi' al-Thani",
		'Jumada al-Ula',
		'Jumada al-Thani',
		'Rajab',
		"Sha'ban",
		'Ramadan',
		'Shawwal',
		"Dhu al-Qi'dah",
		'Dhu al-Hijjah'
	];

	// Use translated values if t is provided, otherwise use defaults
	const days = t
		? //@ts-expect-error should be good
			defaultDays.map((_, i) => t(`date.${defaultDays[i].toLowerCase()}`))
		: defaultDays;

	const months = t
		? //@ts-expect-error should be good
			defaultMonths.map((_, i) => t(`date.${defaultMonths[i].toLowerCase()}`))
		: defaultMonths;

	const hijriMonths = t
		? [
				'muharram',
				'safar',
				'rabiAlAwwal',
				'rabiAlThani',
				'jumadaAlUla',
				'jumadaAlThani',
				'rajab',
				'shaban',
				'ramadan',
				'shawwal',
				'dhuAlQidah',
				'dhuAlHijjah'
				//@ts-expect-error should be good
			].map((month) => t(`date.hijri.${month}`))
		: defaultHijriMonths;

	// Only calculate Hijri date if needed
	const needsHijri = formatStr.includes('h');
	const hijriDate = needsHijri ? gregorianToHijri(date) : null;

	// Define format tokens and their values
	const tokens = {
		// Gregorian date tokens
		EEEE: days[date.getDay()],
		EEE: days[date.getDay()].slice(0, 3),
		MMMM: months[date.getMonth()],
		MMM: months[date.getMonth()].slice(0, 3),
		MM: String(date.getMonth() + 1).padStart(2, '0'),
		M: String(date.getMonth() + 1),
		dd: String(date.getDate()).padStart(2, '0'),
		d: String(date.getDate()),
		yyyy: String(date.getFullYear()),
		yy: String(date.getFullYear()).slice(-2),
		HH: String(date.getHours()).padStart(2, '0'),
		H: String(date.getHours()),
		mm: String(date.getMinutes()).padStart(2, '0'),
		m: String(date.getMinutes()),
		ss: String(date.getSeconds()).padStart(2, '0'),
		s: String(date.getSeconds()),
		...(needsHijri &&
			hijriDate && {
				// Hijri date tokens
				hMMMM: hijriMonths[hijriDate.month - 1],
				hMMM: hijriMonths[hijriDate.month - 1].slice(0, 3),
				hMM: String(hijriDate.month).padStart(2, '0'),
				hM: String(hijriDate.month),
				hdd: String(hijriDate.date).padStart(2, '0'),
				hd: String(hijriDate.date),
				hyyyy: String(hijriDate.year),
				hyy: String(hijriDate.year).slice(-2)
			})
	};

	// Replace tokens in format string
	return Object.entries(tokens)
		.sort(([a], [b]) => b.length - a.length) // Sort by token length to handle longer tokens first
		.reduce((result, [token, value]) => {
			return result.replace(new RegExp(token, 'g'), value);
		}, formatStr);
};
