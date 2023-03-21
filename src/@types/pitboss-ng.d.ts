type Options = {
	memoryLimit?: number,
	timeout?: number,
	heartBeatTick?: number
};
type OptionsRun = {
	context: any,
	libraries: any
};
type Callback = (err: string, result: string | undefined) => void

declare module 'pitboss-ng' {
	export class Pitboss {
		constructor(code: string, options?: Options);

		run(options: OptionsRun, callback: Callback);
		kill();
	}
}
