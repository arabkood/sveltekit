export interface Lesson {
	steps: Array<LessonStep>;
}

export type LessonStep = LessonMarkdown | LessonInteractive;

export type LessonMarkdown = string;

export interface LessonInteractive {
	type: 'quiz' | string;
	question: string;
	code: string;
	solution: number;
	options: string[];
	explanation: string;
	lang: string;
	output?: string;
}
