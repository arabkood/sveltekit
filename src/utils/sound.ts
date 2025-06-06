import { Howl, type HowlOptions } from 'howler';

declare global {
	interface HTMLElement {
		play: () => void;
		stop: () => void;
		setVolume: (level: number) => void;
	}
}

type SoundEventName = keyof HTMLElementEventMap;
type SoundActionEvents = [playEvent: SoundEventName, stopEvent?: SoundEventName];

// Add volume and fadeInDuration to base options
type BaseHowlOptions = Omit<HowlOptions, 'src'> & {
	volume?: number;
	fadeInDuration?: number; // milliseconds
	preload?: boolean | 'metadata';
};

export type SvelteSoundActionOptions = {
	src: HowlOptions['src'];
	events: SoundActionEvents;
} & BaseHowlOptions;

const DEFAULT_VOLUME = 0.7; // Sensible default volume (0.0 to 1.0)
const DEFAULT_FADE_IN_DURATION = 300; // Default fade-in in ms

export class Sound {
	protected howl: Howl;
	protected src: HowlOptions['src'];
	protected howlConfig: BaseHowlOptions;
	private currentPlayId?: number; // To manage fade-in for specific play instance

	constructor(src: HowlOptions['src'], config: BaseHowlOptions = {}) {
		this.src = src;
		// Ensure volume is within 0-1 range and apply default
		const initialVolume =
			config.volume !== undefined ? Math.max(0, Math.min(1, config.volume)) : DEFAULT_VOLUME;

		this.howlConfig = {
			...config,
			volume: initialVolume, // Howler will use this as its internal volume
			preload: config.preload ?? true
		};

		this.howl = new Howl({
			src: this.src,
			autoSuspend: false,
			html5: true,
			...this.howlConfig
		});
	}

	update(newSrc: HowlOptions['src'], newConfig: BaseHowlOptions = {}) {
		this.howl.unload();
		this.src = newSrc;

		const newVolume =
			newConfig.volume !== undefined
				? Math.max(0, Math.min(1, newConfig.volume))
				: this.howlConfig.volume; // Keep current if not specified

		const newPreload =
			newConfig.preload !== undefined ? newConfig.preload : this.howlConfig.preload;

		this.howlConfig = {
			...this.howlConfig, // Retain old settings like loop, etc.
			...newConfig,
			volume: newVolume,
			preload: newPreload
		};

		this.howl = new Howl({
			src: this.src,
			...this.howlConfig
		});
	}

	destroy() {
		this.stop();
		this.howl.unload();
	}

	play() {
		if (!this.howl) return;

		const targetVolume = this.howlConfig.volume ?? DEFAULT_VOLUME;
		const fadeIn = this.howlConfig.fadeInDuration ?? DEFAULT_FADE_IN_DURATION;

		// Stop any previous instance if it's still fading or playing
		if (this.currentPlayId !== undefined) {
			this.howl.stop(this.currentPlayId);
		}

		this.currentPlayId = this.howl.play();

		if (fadeIn > 0 && this.currentPlayId !== undefined) {
			this.howl.volume(0, this.currentPlayId); // Start at volume 0 for this specific instance
			this.howl.fade(0, targetVolume, fadeIn, this.currentPlayId);
		} else if (this.currentPlayId !== undefined) {
			// If no fade, ensure the instance plays at the target volume
			// (Howl's main volume is already set, but this confirms for the instance)
			this.howl.volume(targetVolume, this.currentPlayId);
		}
	}

	stop() {
		if (this.howl) {
			if (this.currentPlayId !== undefined) {
				this.howl.stop(this.currentPlayId);
				this.currentPlayId = undefined;
			} else {
				this.howl.stop(); // Stop all instances if no specific ID
			}
		}
	}

	setVolume(level: number) {
		const newVolume = Math.max(0, Math.min(1, level));
		this.howlConfig.volume = newVolume;
		if (this.howl) {
			this.howl.volume(newVolume); // Set global volume for the Howl object
		}
	}
}

class SvelteSoundPlayer extends Sound {
	private node: HTMLElement;
	private currentEvents: SoundActionEvents;
	private boundPlay: () => void;
	private boundStop: () => void;
	private boundSetVolume: (level: number) => void;

	constructor(node: HTMLElement, options: SvelteSoundActionOptions) {
		const { src, events, ...howlConfig } = options;
		super(src, howlConfig);
		this.node = node;
		this.currentEvents = events;

		this.boundPlay = this.play.bind(this);
		this.boundStop = this.stop.bind(this);
		this.boundSetVolume = this.setVolume.bind(this);

		this.attachElementControls();
	}

	private attachElementControls() {
		this.node.play = this.boundPlay;
		this.node.stop = this.boundStop;
		this.node.setVolume = this.boundSetVolume;

		const [playEvent, stopEvent] = this.currentEvents;
		this.node.addEventListener(playEvent, this.boundPlay);
		if (stopEvent) {
			this.node.addEventListener(stopEvent, this.boundStop);
		}
	}

	private removeElementControls() {
		const [playEvent, stopEvent] = this.currentEvents;
		this.node.removeEventListener(playEvent, this.boundPlay);
		if (stopEvent) {
			this.node.removeEventListener(stopEvent, this.boundStop);
		}
		// delete (this.node as any).play;
		// delete (this.node as any).stop;
		// delete (this.node as any).setVolume;
	}

	update(newOptions: SvelteSoundActionOptions) {
		this.removeElementControls(); // Remove old event listeners first
		const { src, events, ...newHowlConfig } = newOptions;

		// Call super.update which handles src and Howl recreation
		super.update(src, newHowlConfig);

		// If volume is explicitly in newHowlConfig, setVolume handles it.
		// If not, super.update retained the old howlConfig.volume or used its default.
		// No separate call to this.setVolume() needed here unless newHowlConfig.volume
		// was meant to be handled differently than other howl options by super.update.
		// The current super.update will correctly set the new volume on the new Howl instance.

		this.currentEvents = events; // Update events if they changed
		this.attachElementControls(); // Re-attach with potentially new events
	}

	destroy() {
		this.removeElementControls();
		super.destroy();
	}
}

export function sound(node: HTMLElement, options: SvelteSoundActionOptions) {
	const player = new SvelteSoundPlayer(node, options);
	return {
		update: (newOptions: SvelteSoundActionOptions) => player.update(newOptions),
		destroy: () => player.destroy()
		// Optionally expose methods if you don't want them on the node
		// play: () => player.play(),
		// stop: () => player.stop(),
		// setVolume: (level: number) => player.setVolume(level),
	};
}

export function useSound(
	src: HowlOptions['src'],
	events: SoundActionEvents,
	baseHowlOptions?: BaseHowlOptions
) {
	return (node: HTMLElement, overrideOptions?: Partial<SvelteSoundActionOptions>) => {
		const combinedOptions: SvelteSoundActionOptions = {
			src,
			events,
			volume: DEFAULT_VOLUME, // Apply default here for useSound
			fadeInDuration: DEFAULT_FADE_IN_DURATION,
			...baseHowlOptions,
			...overrideOptions
		};
		return sound(node, combinedOptions);
	};
}
