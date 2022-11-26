import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";
import { getRPCError } from "../../helpers/errorHandling.js";

function useWallet() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, contract } } = useEth();

	/* ---- States ---------------------------------- */
	const [wallet, setWallet] = useState(null);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		// This function fetch the new wallet and update the hook state.
		const update = async () => {
			try {
				const wallet = await contract.methods.getWallet().call({ from: account });
				setWallet(wallet);
			} catch (err) {
				const rpcErr = getRPCError(err);
				console.error(rpcErr.message);
			}
		};

		// If the contract exists, we fetch the wallet once and start an event listener.
		let ticketEvent = null;
		if (contract) {
			update().catch(console.error);
			ticketEvent = contract.events.BoughtTicket({ filter: {owner: account} }).on("data", update);
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (ticketEvent) {
				ticketEvent.removeAllListeners("data");
			}
		};
	}, [contract, account]);

	/* ---- Expose hook ----------------------------- */
	return wallet;
}

export default useWallet;
