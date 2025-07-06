export interface Lesson {
	steps: Array<LessonStep>;
}

export type LessonStep = LessonMarkdown | LessonInteractive;

export type LessonMarkdown = string;

export type LessonInteractive =
	| FillQuestion
	| QuizQuestion
	| OrderQuestion
	| BugQuestion
	| MatchQuestion;

export type LessonInteractiveAnswer =
	| FillAnswer
	| QuizAnswer
	| OrderAnswer
	| BugAnswer
	| MatchAnswer;
export type LessonInteractiveAnswers = (null | LessonInteractiveAnswer)[];

export type FillAnswer = string[];
export type QuizAnswer = number;

export interface FillQuestion {
	type: 'fill';
	lang: string;
	question: string;
	code: string;
	solution: string[];
}

export interface QuizQuestion {
	type: 'quiz';
	lang: string;
	question: string;
	code: string;
	solution: number;
	options: string[];
	explanation: string;
}

export interface OrderQuestion {
	type: 'order';
	lang: string;
	question: string;
	code: string[];
	alternate?: number[][];
}
export type OrderAnswer = number[];

export interface BugQuestion {
	type: 'bug';
	lang: string;
	question: string;
	code: string;
	solution: number; // 0-indexed line number
	hint?: string;
	explanation?: string;
	expectedOutput?: string;
	actualOutput?: string;
}

export type BugAnswer = number;

export type MatchItem =
	| { type: 'text'; content: string }
	| { type: 'code'; content: string; lang: string };

// not implemented
export interface MatchQuestion {
	type: 'match';
	question: string;
	prompts: MatchItem[]; // The left column
	options: MatchItem[]; // The right column (will be shuffled)
	solution: number[]; // Index i = prompt index, Value = correct option index
	explanation?: string;
}

// not implemented
export type MatchAnswer = (number | null)[]; // User's pairings
