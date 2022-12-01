/**
 * @module helpers/accessibility
 * @category helpers
 * @author Alexis L. <alexis.lecomte@supinfo.com>
 */

/**
 * Call an event handler on keyDown.
 * @function
 *
 * @example
 * <button onClick={() => handleClick(someParam)} onKeyDown={e => clickOnEnter(e, handleClick, someParam)}>
 *   The design is very human
 * </button>
 *
 * @param {KeyboardEvent} e - The event
 * @param {function} callback - The event handler to call
 * @param {...*} [callbackArgs] - Parameters to pass to the callback when the event is triggerred
 */
export function clickOnEnter(e, callback, ...callbackArgs) {
	if (e.key !== "Enter") return;

	if (callbackArgs) callback(...callbackArgs);
	else callback(e);
}

/**
 * This function is an extension of {@link clickOnEnter}. When the event is not on a button, it is necessary to add a
 * function `onKeyDown()` as well as a `role` property and a `tabIndex`. This function take care of it.
 * @function
 *
 * @example
 * <div {...eventOnElement(handleClick, someParam, someOtherParam)}>
 *   The design is <em>still</em> very human
 * </div>
 *
 * @param {function} callback - The event handler to call
 * @param {...*} [callbackArgs] - Parameters to pass to the callback when the event is triggerred
 * @return {{ onClick: (function(): void), onKeyDown: (function(e: KeyboardEvent): void), role: "button", tabIndex: 0 }}
 */
export function eventOnElement(callback, ...callbackArgs) {
	// noinspection JSUnusedGlobalSymbols
	return {
		onClick: () => callback(...callbackArgs),
		onKeyDown: e => clickOnEnter(e, callback, ...callbackArgs),
		role: "button",
		tabIndex: 0
	};
}
