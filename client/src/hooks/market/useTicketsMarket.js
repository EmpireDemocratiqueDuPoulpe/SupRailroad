import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { useMessages } from "../../contexts/MessageContext";
import { useEth } from "../../contexts/EthContext";

function useTicketsMarket({ onTicketBought } = {}) {
	/* ---- Contexts -------------------------------- */
	const messages = useMessages();
	const { state: { account, contracts: {ticketMarket} } } = useEth();

	/* ---- States ---------------------------------- */
	const [standardPrice, setStandardPrice] = useState(/** @type {number} */ null);
	const [requestId, setRequestId] = useState(/** @type {number} */ null);
	const [processingPrice, setProcessingPrice] = useState(/** @type {boolean} */ false);
	const [price, setPrice] = useState(/** @type {number} */ null);

	/* ---- Functions ------------------------------- */
	const getStandardPrice = useCallback(async () => {
		try {
			if (ticketMarket) {
				// noinspection JSUnresolvedFunction
				const amount = await ticketMarket.methods.getStandardPrice().call({ from: account });
				setStandardPrice(parseFloat(Web3.utils.fromWei(`${amount}`, "ether")));
				setPrice(null);
			}
		} catch (err) { messages.addError(err, true); }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticketMarket, account]);

	const changeStandardPrice = async (newPrice) => {
		try {
			if (ticketMarket) {
				// noinspection JSUnresolvedFunction
				await ticketMarket.methods.setPrice(Web3.utils.toWei(newPrice, "ether")).send({ from: account });
			}
		} catch (err) { messages.addError(err, true); }
	};

	const getPrice = async (types, points, cardId) => {
		try {
			if (ticketMarket) {
				setProcessingPrice(true);
				// noinspection JSUnresolvedFunction
				await ticketMarket.methods.getPrice(types, points, cardId).send({ from: account });
			}
		} catch (err) { messages.addError(err, true); }
	};

	const buyTicket = async () => {
		try {
			if (ticketMarket) {
				// noinspection JSUnresolvedFunction
				await ticketMarket.methods.buyTicket().send({ from: account, value: Web3.utils.toWei(`${price}`, "ether") });
			}
		} catch (err) { messages.addError(err, true); }
	};

	/* ---- Effects --------------------------------- */
	// Keep the standard price updated
	useEffect(() => {
		// Fetch the price once and start an event listener.
		let priceChangeListener = null;
		if (ticketMarket) {
			getStandardPrice().catch(console.error);
			// noinspection JSValidateTypes
			priceChangeListener = ticketMarket.events.TicketPriceChanged().on("data", getStandardPrice);
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (priceChangeListener) {
				priceChangeListener.removeAllListeners("data");
			}
		};
	}, [ticketMarket, account, getStandardPrice]);

	// Listen for a request id
	useEffect(() => {
		// Start an event listener.
		let requestedPriceListener = null;
		if (ticketMarket) {
			// noinspection JSValidateTypes
			requestedPriceListener = ticketMarket.events.TicketPriceRequested({ filter: {caller: account} }).on("data", data => {
				setRequestId(parseInt(data.returnValues.requestId, 10));
			});
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (requestedPriceListener) {
				requestedPriceListener.removeAllListeners("data");
			}
		};
	}, [ticketMarket, account, requestId]);

	// Listen for a requested price
	useEffect(() => {
		// Start an event listener.
		let receivedPriceListener = null;
		if (ticketMarket && requestId) {
			// noinspection JSValidateTypes
			receivedPriceListener = ticketMarket.events.TicketPriceCalculated({ filter: {requestId, caller: account} }).on("data", data => {
				setPrice(parseFloat(Web3.utils.fromWei(data.returnValues.price, "ether")));
				setProcessingPrice(false);
			});
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (receivedPriceListener) {
				receivedPriceListener.removeAllListeners("data");
			}
		};
	}, [ticketMarket, account, requestId]);

	// Listen for a bought ticket
	useEffect(() => {
		// Start an event listener.
		let ticketBoughtListener = null;
		if (ticketMarket) {
			// noinspection JSValidateTypes
			ticketBoughtListener = ticketMarket.events.BoughtTicket({ filter: {requestId, owner: account} }).on("data", () => {
				setRequestId(null);
				messages.addSuccess("Achat validé : Bon voyage !");

				if (onTicketBought) {
					onTicketBought();
				}
			});
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (ticketBoughtListener) {
				ticketBoughtListener.removeAllListeners("data");
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticketMarket, account, requestId]);

	/* ---- Expose hook ----------------------------- */
	console.log(processingPrice);
	return { standardPrice, setStandardPrice: changeStandardPrice, processingPrice, currentPrice: price, requestPrice: getPrice, buy: buyTicket };
}

export default useTicketsMarket;
