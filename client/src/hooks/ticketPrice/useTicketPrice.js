import { useState, useEffect } from "react";
import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";

function useTicketPrice() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, contract } } = useEth();

	/* ---- States ---------------------------------- */
	const [price, setPrice] = useState(/** @type {string} */ null);
	const [standardPrice, setStandardPrice] = useState(/** @type {string} */ null);
	const [requestId, setRequestId] = useState(/** @type {number} */ null);

	/* ---- Functions ------------------------------- */
	const getPrice = async (origin, destination) => {
		const requestId = await contract.methods.getPrice(origin, destination).send({ from: account });
		setRequestId(requestId);
	};

	const changePrice = async (newPrice) => {
		if (contract) {
			try {
				await contract.methods.setPrice(Web3.utils.toWei(newPrice, "ether")).send({ from: account });
			} catch (err) {
				// TODO: Err modal
				console.error(err);
			}
		}
	};

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		// Fetch the new ticket price and update the hook state.
		const getStandardPrice = async () => {
			const amount = await contract.methods.getStandardPrice().call({ from: account });
			setStandardPrice(`${amount}`);
			setPrice(null);
		};

		// Fetch the price once and start an event listener.
		let priceChangeListener = null;
		if (contract) {
			getStandardPrice().catch(console.error);
			priceChangeListener = contract.events.TicketPriceChanged().on("data", getStandardPrice);
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (priceChangeListener) {
				priceChangeListener.removeAllListeners("data");
			}
		};
	}, [contract, account]);

	useEffect(() => {
		let receivedPriceListener = null;
		if (contract) {
			receivedPriceListener = contract.events.TicketPriceCalculated({ filter: {caller: account, requestId} }).on("data", data => {
				setRequestId(null);
				setPrice(data.returnValues.price);
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
	return { price, standardPrice, set: changePrice, get: getPrice };
}

export default useTicketPrice;
