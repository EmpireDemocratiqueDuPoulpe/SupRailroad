export class NotImplemented extends Error {
	constructor(message = "", ...args) {
		// noinspection JSCheckFunctionSignatures
		super(message, ...args);
		this.message = message + " has not yet been implemented.";
	}
}
