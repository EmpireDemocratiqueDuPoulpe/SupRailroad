/**
 * Apply discounts to the calculated price.
 * @module lib/discounts
 * @author Alexis L. <alexis.lecomte@supinfo.com>
 */

/*** Typedefs *********************************************************************************************************/
/**
 * @typedef {Object} Card
 * @property {number} cardId - ID of the card.
 * @property {number} discountPercent - Applied discount by using this card.
 * @property {string} owner - The user who own this card.
 */


/*** Functions ********************************************************************************************************/
/**
 * Gets a discount card by its ID.
 * @function
 * @async
 * @private
 *
 * @param {Contract} cardMarket - Card market.
 * @param {string} owner - The user who asked the price.
 * @param {number} cardId - The ID of the wanted discount card.
 * @throws {Error} - If the card ID is invalid.
 * @return {Promise<Card>}
 */
async function getDiscountCard(cardMarket, owner, cardId) {
	const ownerCards = await cardMarket.methods.getCards().call({ from: owner });
	const card = ownerCards.filter(c => c.cardId === cardId);

	if (card.length === 0) {
		throw new Error("Invalid cardId!");
	} else return card[0];
}

/**
 * Applies a discount to a price using a discount card.
 * @function
 * @async
 *
 * @param {Contract} cardMarket - Card market.
 * @param {string} owner - The user who asked the price.
 * @param {number|null|undefined} cardId - The ID of the wanted discount card.
 * @param {number} price - Current calculated price.
 * @return {Promise<number>} - The price after the discount.
 */
export async function useDiscountCard(cardMarket, owner, cardId, price) {
	if (!cardId || (cardId < 0)) return price;
	else {
		const card = await getDiscountCard(cardMarket, owner, cardId);
		return ((price * (100 - card.discountPercent)) / 100);
	}
}
