export type ImageHandlerEntry = {
	id: number;
	width: number;
	height: number;
};

export class ImageHandler {
	protected entries: Map<string, ImageHandlerEntry>;
	protected id: number;

	constructor() {
		this.entries = new Map();
		this.id = 0;
	}

	addEntry(key: string, width: number, height: number): ImageHandler {
		let entry = this.entries.get(key);
		if (entry != null) {
			throw new Error();
		}
		let id = this.id;
		this.entries.set(key, {
			id: id,
			width,
			height
		});
		this.id += 1;
		return this;
	}

	getEntry(key: string): ImageHandlerEntry {
		let entry = this.entries.get(key);
		if (entry == null) {
			throw new Error(`Expected an image handler entry for key "${key}"!`);
		}
		return entry;
	}
};
