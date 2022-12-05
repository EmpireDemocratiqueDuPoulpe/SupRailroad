import { useState, useEffect } from "react";
import { useErrors } from "../../contexts/ErrorContext";
import { useEth } from "../../contexts/EthContext";

function useWallet() {
	/* ---- Contexts -------------------------------- */
	const errors = useErrors();
	const { state: { account, contract } } = useEth();

	/* ---- States ---------------------------------- */
	const [wallet, setWallet] = useState(null);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		// Fetch the new wallet and update the hook state.
		const update = async () => {
			try {
				if (contract) {
					// noinspection JSUnresolvedFunction
					const wallet = await contract.methods.getWallet().call({ from: account });
					setWallet(wallet);
				}
			} catch (err) { errors.add(err, true); }
		};

		// Fetch the wallet once and start an event listener.
		let ticketBoughtListener = null;
		if (contract) {
			update().catch(console.error);
			// noinspection JSValidateTypes
			ticketBoughtListener = contract.events.BoughtTicket({ filter: {owner: account} }).on("data", update);
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (ticketBoughtListener) {
				ticketBoughtListener.removeAllListeners("data");
			}
		};
	}, [contract, account, errors]);

	/* ---- Expose hook ----------------------------- */
	return wallet;
}

export default useWallet;
