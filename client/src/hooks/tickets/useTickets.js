import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";

function useTickets() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, contract } } = useEth();

	/* ---- States ---------------------------------- */
	const [standardPrice, setStandardPrice] = useState(/** @type {number} */ null);
	const [requestId, setRequestId] = useState(/** @type {number} */ null);
	const [price, setPrice] = useState(/** @type {number} */ null);

	/* ---- Functions ------------------------------- */
	const getStandardPrice = useCallback(async () => {
		// noinspection JSUnresolvedFunction
		const amount = await contract.methods.getStandardPrice().call({ from: account });
		setStandardPrice(parseFloat(Web3.utils.fromWei(`${amount}`, "ether")));
		setPrice(null);
	}, [contract, account]);

	const changeStandardPrice = async (newPrice) => {
		try {
			// noinspection JSUnresolvedFunction
			await contract.methods.setPrice(Web3.utils.toWei(newPrice, "ether")).send({ from: account });
		} catch (err) {
			// TODO: Err modal
			console.error(err);
		}
	};

	const getPrice = async points => {
		// noinspection JSUnresolvedFunction
		const requestId = await contract.methods.getPrice(points).send({ from: account });
		setRequestId(requestId);
	};

	const buyTicket = async () => {
		try {
			// noinspection JSUnresolvedFunction
			await contract.methods.buyTicket().send({ from: account, value: Web3.utils.toWei(`${price}`, "ether") });
		} catch (err) {
			// TODO: Error modal
			console.error(err);
		}
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
