import { useMessages } from "../../contexts/MessageContext";
import { useEth } from "../../contexts/EthContext";
import {useEffect, useState} from "react";
import Web3 from "web3";

function useMarket() {
	const messages = useMessages();
	const { state: { account, contracts: {cardMarket} } } = useEth();

	/* ---- States ---------------------------------- */
	const [onSaleCards, setOnSaleCards] = useState(/** @type {Array<Object>} */ []);

	/* ---- Functions ------------------------------- */
	const buyCard = async (price, cardId) => {
		try {
			if (cardMarket) {
				// noinspection JSUnresolvedFunction
				await cardMarket.methods.buyCard(cardId).send({ from: account, value: Web3.utils.toWei(price, "ether") });
			}
		} catch (err) { messages.addError(err, true); }
	};

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		const getAllOnSale = async () => {
			try {
				if (cardMarket) {
					// noinspection JSUnresolvedFunction
					const onSaleCards = await cardMarket.methods.getSaleableCards().call({ from: account });
					setOnSaleCards(onSaleCards);
				}
			} catch (err) { messages.addError(err, true); }
		};
		getAllOnSale().catch(console.error);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardMarket, account]);

	/* ---- Expose hook ----------------------------- */
	return { onSaleCards, buy: buyCard };
}

export default useMarket;
