import { useState, useEffect, useCallback } from "react";
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

	const getAllOnSale = useCallback(async () => {
		try {
			if (cardMarket && fetchCards) {
				// noinspection JSUnresolvedFunction
				const cards = await cardMarket.methods.getSaleableCards().call({ from: account });
				setSellableCards(cards);
			}
		} catch (err) { messages.addError(err, true); }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardMarket, account, fetchCards]);

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
	useEffect(() => {
		getAllOnSale().catch(console.error);
	}, [cardMarket, account, getAllOnSale]);

	/* ---- Expose hook ----------------------------- */
	return { sellableCards, create: createCard, approve: approveCard, retrieveApproved: retrieveApprovedCard, buy: buyCard };
}

export default useCardsMarket;
