import { useState, useEffect } from "react";
import { useMessages } from "../../contexts/MessageContext";
import { useEth } from "../../contexts/EthContext";

function useWallet() {
	/* ---- Contexts -------------------------------- */
	const messages = useMessages();
	const { state: { account, contracts: {ticketFactory} } } = useEth();

	/* ---- States ---------------------------------- */
	const [wallet, setWallet] = useState(null);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		// Fetch the new wallet and update the hook state.
		const update = async () => {
			try {
				if (ticketFactory) {
					// noinspection JSUnresolvedFunction
					const wallet = await ticketFactory.methods.getWallet().call({ from: account });
					setWallet(wallet);
				}
			} catch (err) { messages.addError(err, true); }
		};

		// Fetch the wallet once and start an event listener.
		let ticketBoughtListener = null;
		if (ticketFactory) {
			update().catch(console.error);
			// noinspection JSValidateTypes
			ticketBoughtListener = ticketFactory.events.BoughtTicket({ filter: {owner: account} }).on("data", update);
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (ticketBoughtListener) {
				ticketBoughtListener.removeAllListeners("data");
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticketFactory, account]);

	/* ---- Expose hook ----------------------------- */
	return wallet;
}

export default useWallet;
