import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { useErrors } from "../../contexts/ErrorContext";
import { useEth } from "../../contexts/EthContext";

function useTickets() {
	/* ---- Contexts -------------------------------- */
	const errors = useErrors();
	const { state: { account, contracts: {ticketFactory} } } = useEth();

	/* ---- States ---------------------------------- */
	const [standardPrice, setStandardPrice] = useState(/** @type {number} */ null);
	const [requestId, setRequestId] = useState(/** @type {number} */ null);
	const [price, setPrice] = useState(/** @type {number} */ null);

	/* ---- Functions ------------------------------- */
	const getStandardPrice = useCallback(async () => {
		try {
			if (ticketFactory) {
				// noinspection JSUnresolvedFunction
				const amount = await ticketFactory.methods.getStandardPrice().call({ from: account });
				setStandardPrice(parseFloat(Web3.utils.fromWei(`${amount}`, "ether")));
				setPrice(null);
			}
		} catch (err) { errors.add(err, true); }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticketFactory, account]);

	const changeStandardPrice = async (newPrice) => {
		try {
			if (ticketFactory) {
				// noinspection JSUnresolvedFunction
				await ticketFactory.methods.setPrice(Web3.utils.toWei(newPrice, "ether")).send({ from: account });
			}
		} catch (err) { errors.add(err, true); }
	};

	const getPrice = async points => {
		try {
			if (ticketFactory) {
				// noinspection JSUnresolvedFunction
				await ticketFactory.methods.getPrice(points).send({ from: account });
			}
		} catch (err) { errors.add(err, true); }
	};

	const buyTicket = async () => {
		try {
			if (ticketFactory) {
				// noinspection JSUnresolvedFunction
				await ticketFactory.methods.buyTicket().send({ from: account, value: Web3.utils.toWei(`${price}`, "ether") });
			}
		} catch (err) { errors.add(err, true); }
	};

	/* ---- Effects --------------------------------- */
	// Keep the standard price updated
	useEffect(() => {
		// Fetch the price once and start an event listener.
		let priceChangeListener = null;
		if (ticketFactory) {
			getStandardPrice().catch(console.error);
			// noinspection JSValidateTypes
			priceChangeListener = ticketFactory.events.TicketPriceChanged().on("data", getStandardPrice);
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (priceChangeListener) {
				priceChangeListener.removeAllListeners("data");
			}
		};
	}, [ticketFactory, account, getStandardPrice]);

	// Listen for a request id
	useEffect(() => {
		// Start an event listener.
		let requestedPriceListener = null;
		if (ticketFactory) {
			// noinspection JSValidateTypes
			requestedPriceListener = ticketFactory.events.TicketPriceRequested({ filter: {caller: account} }).on("data", data => {
				setRequestId(parseInt(data.returnValues.requestId, 10));
			});
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (requestedPriceListener) {
				requestedPriceListener.removeAllListeners("data");
			}
		};
	}, [ticketFactory, account, requestId]);

	// Listen for a requested price
	useEffect(() => {
		// Start an event listener.
		let receivedPriceListener = null;
		if (ticketFactory && requestId) {
			// noinspection JSValidateTypes
			receivedPriceListener = ticketFactory.events.TicketPriceCalculated({ filter: {requestId, caller: account} }).on("data", data => {
				setPrice(parseFloat(Web3.utils.fromWei(data.returnValues.price, "ether")));
			});
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (receivedPriceListener) {
				receivedPriceListener.removeAllListeners("data");
			}
		};
	}, [ticketFactory, account, requestId]);

	// Listen for a bought ticket
	useEffect(() => {
		// Start an event listener.
		let ticketBoughtListener = null;
		if (ticketFactory) {
			// noinspection JSValidateTypes
			ticketBoughtListener = ticketFactory.events.BoughtTicket({ filter: {requestId, owner: account} }).on("data", () => {
				setRequestId(null);
				console.log("Ticket acheté");
			});
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (ticketBoughtListener) {
				ticketBoughtListener.removeAllListeners("data");
			}
		};
	}, [ticketFactory, account, requestId]);

	/* ---- Expose hook ----------------------------- */
	return { standardPrice, setStandardPrice: changeStandardPrice, currentPrice: price, requestPrice: getPrice, buy: buyTicket };
}

export default useTickets;
