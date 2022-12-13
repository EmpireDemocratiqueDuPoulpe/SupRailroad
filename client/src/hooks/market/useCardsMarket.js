import { useState, useEffect } from "react";
import Web3 from "web3";
import { useMessages } from "../../contexts/MessageContext";
import { useEth } from "../../contexts/EthContext";

function useCardsMarket(fetchCards = true) {
	const messages = useMessages();
	const { state: { account, contracts: {cardMarket} } } = useEth();

	/* ---- States ---------------------------------- */
	const [sellableCards, setSellableCards] = useState(/** @type {Array<Object>} */ []);

	/* ---- Functions ------------------------------- */
	const createCard = async (price, discountPercent, name, imageURI, description, count) => {
		try {
			if (cardMarket) {
				// noinspection JSUnresolvedFunction
				await cardMarket.methods.createCard(Web3.utils.toWei(price, "ether"), discountPercent, name, imageURI, description, count).send({ from: account });
			}
		} catch (err) { messages.addError(err, true); }
	};

	const approveCard = async (target, cardId) => {
		try {
			if (cardMarket) {
				// noinspection JSUnresolvedFunction
				await cardMarket.methods.setApproval(target, cardId).send({ from: account });
			}
		} catch (err) { messages.addError(err, true); }
	};

	const retrieveApprovedCard = async (owner, target, cardId) => {
		try {
			if (cardMarket) {
				// noinspection JSUnresolvedFunction
				await cardMarket.methods.transferCard(owner, target, cardId).send({ from: account });
			}
		} catch (err) { messages.addError(err, true); }
	};

	const buyCard = async (cardId, price) => {
		try {
			if (cardMarket) {
				// noinspection JSUnresolvedFunction
				await cardMarket.methods.buyCard(cardId).send({ from: account, value: Web3.utils.toWei(price, "ether") });
			}
		} catch (err) { messages.addError(err, true); }
	};

	/* ---- Effects --------------------------------- */
	// Keep the market updated
	useEffect(() => {
		const getAllOnSale = async () => {
			try {
				if (cardMarket && fetchCards) {
					// noinspection JSUnresolvedFunction
					const cards = await cardMarket.methods.getSaleableCards().call({ from: account });
					setSellableCards(cards);
				}
			} catch (err) { messages.addError(err, true); }
		};

		// Fetch the market once and start an event listener.
		let cardBoughtListener = null;
		if (cardMarket) {
			getAllOnSale().catch(console.error);
			// noinspection JSValidateTypes
			cardBoughtListener = cardMarket.events.BoughtCard().on("data", data => {
				if (data.returnValues.owner === account) {
					messages.addSuccess("Carte de réduction achetée.");
				}

				getAllOnSale().catch(console.error);
			});
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (cardBoughtListener) {
				cardBoughtListener.removeAllListeners("data");
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardMarket, account, fetchCards]);

	/* ---- Expose hook ----------------------------- */
	return { sellableCards, create: createCard, approve: approveCard, retrieveApproved: retrieveApprovedCard, buy: buyCard };
}

export default useCardsMarket;
