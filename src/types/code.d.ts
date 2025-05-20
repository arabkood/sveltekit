export interface CodeConfig {
	image: string;
	files: Array<CodeFileConfig>;
	flags: Record<string, string>;
}

export interface CodeFileConfig {
	idx: number;
	path: string;
	lang: string;
	ro?: boolean;
}

export interface Code {
	config: CodeConfig;
	files: CodeFiles;
	docs: CodeDocs;
	example?: Record<string, string>;
}

export type CodeDocs = Record<string, string>;

export type CodeFiles = Record<string, string>;

export type TestResult = {
	name: string;
	status: 'pass' | 'fail';
	message?: string;
	test_code?: string;
};

export type CodeResults = {
	status: 'wait' | string;
	xp_reward: number;
	results: {
		status: 'error' | 'pass' | 'fail';
		tests: TestResult[];
		message?: string;
	};
};
