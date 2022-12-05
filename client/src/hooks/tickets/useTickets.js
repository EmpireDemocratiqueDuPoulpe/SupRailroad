import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { useErrors } from "../../contexts/ErrorContext";
import { useEth } from "../../contexts/EthContext";

function useTickets() {
	/* ---- Contexts -------------------------------- */
	const errors = useErrors();
	const { state: { account, contract } } = useEth();

	/* ---- States ---------------------------------- */
	const [standardPrice, setStandardPrice] = useState(/** @type {number} */ null);
	const [requestId, setRequestId] = useState(/** @type {number} */ null);
	const [price, setPrice] = useState(/** @type {number} */ null);

	/* ---- Functions ------------------------------- */
	const getStandardPrice = useCallback(async () => {
		try {
			if (contract) {
				// noinspection JSUnresolvedFunction
				const amount = await contract.methods.getStandardPrice().call({ from: account });
				setStandardPrice(parseFloat(Web3.utils.fromWei(`${amount}`, "ether")));
				setPrice(null);
			}
		} catch (err) { errors.add(err, true); }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contract, account]);

	const changeStandardPrice = async (newPrice) => {
		try {
			if (contract) {
				// noinspection JSUnresolvedFunction
				await contract.methods.setPrice(Web3.utils.toWei(newPrice, "ether")).send({ from: account });
			}
		} catch (err) { errors.add(err, true); }
	};

	const getPrice = async points => {
		try {
			if (contract) {
				// noinspection JSUnresolvedFunction
				const requestId = await contract.methods.getPrice(points).send({ from: account });
				setRequestId(requestId);
			}
		} catch (err) { errors.add(err, true); }
	};

	const buyTicket = async () => {
		try {
			if (contract) {
				// noinspection JSUnresolvedFunction
				await contract.methods.buyTicket().send({ from: account, value: Web3.utils.toWei(`${price}`, "ether") });
			}
		} catch (err) { errors.add(err, true); }
	};

	/* ---- Effects --------------------------------- */
	// Keep the standard price updated
	useEffect(() => {
		// Fetch the price once and start an event listener.
		let priceChangeListener = null;
		if (contract) {
			getStandardPrice().catch(console.error);
			// noinspection JSValidateTypes
			priceChangeListener = contract.events.TicketPriceChanged().on("data", getStandardPrice);
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (priceChangeListener) {
				priceChangeListener.removeAllListeners("data");
			}
		};
	}, [contract, account, getStandardPrice]);

	// Listen for a requested price
	useEffect(() => {
		// Start an event listener.
		let receivedPriceListener = null;
		if (contract) {
			// noinspection JSValidateTypes
			receivedPriceListener = contract.events.TicketPriceCalculated({ filter: {caller: account, requestId} }).on("data", data => {
				setRequestId(null);
				setPrice(parseFloat(Web3.utils.fromWei(data.returnValues.price, "ether")));
			});
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (receivedPriceListener) {
				receivedPriceListener.removeAllListeners("data");
			}
		};
	}, [contract, account, requestId]);

	/* ---- Expose hook ----------------------------- */
	return { standardPrice, setStandardPrice: changeStandardPrice, currentPrice: price, requestPrice: getPrice, buy: buyTicket };
}

export default useTickets;
