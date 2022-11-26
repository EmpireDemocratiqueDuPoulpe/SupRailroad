import { useState, useEffect } from "react";
import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";

function useTicketPrice() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, contract } } = useEth();

	/* ---- States ---------------------------------- */
	const [price, setPrice] = useState(/** @type {string} */ null);

	/* ---- Functions ------------------------------- */
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
		const getPrice = async () => {
			const amount = await contract.methods.getPrice().call({ from: account });
			setPrice(`${amount}`);
		};

		// Fetch the price once and start an event listener.
		let priceChangeListener = null;
		if (contract) {
			getPrice().catch(console.error);
			priceChangeListener = contract.events.TicketPriceChanged().on("data", getPrice);
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (priceChangeListener) {
				priceChangeListener.removeAllListeners("data");
			}
		};
	}, [contract, account]);

	/* ---- Expose hook ----------------------------- */
	return { price, set: changePrice };
}

export default useTicketPrice;
