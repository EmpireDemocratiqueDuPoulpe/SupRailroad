import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";

function useTicketPrice() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, contract } } = useEth();

	/* ---- States ---------------------------------- */
	const [price, setPrice] = useState(/** @type {string} */ null);

	/* ---- Functions ------------------------------- */
	const changePrice = async () => {};

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		const getPrice = async () => {
			if (contract) {
				const amount = await contract.methods.getPrice().call({ from: account });
				setPrice(`${amount}`);
			}
		};

		getPrice().catch(console.error);
	}, [contract, account]);

	/* ---- Expose hook ----------------------------- */
	return { price, set: changePrice };
}

export default useTicketPrice;
