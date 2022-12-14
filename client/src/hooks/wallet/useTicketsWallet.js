import { useState, useEffect } from "react";
import { useMessages } from "../../contexts/MessageContext";
import { useEth } from "../../contexts/EthContext";

function useTicketsWallet() {
	/* ---- Contexts -------------------------------- */
	const messages = useMessages();
	const { state: { account, contracts: {ticketMarket} } } = useEth();

	/* ---- States ---------------------------------- */
	const [wallet, setWallet] = useState({});

	/* ---- Effects --------------------------------- */
	// Keep the wallet updated
	useEffect(() => {
		// Fetch the new wallet and update the hook state.
		const update = async () => {
			try {
				if (ticketMarket) {
					// noinspection JSUnresolvedFunction
					setWallet({
						tickets: await ticketMarket.methods.getTickets().call({ from: account })
					});
				}
			} catch (err) { messages.addError(err, true); }
		};

		// Fetch the wallet once and start an event listener.
		let ticketBoughtListener = null;
		if (ticketMarket) {
			update().catch(console.error);
			// noinspection JSValidateTypes
			ticketBoughtListener = ticketMarket.events.BoughtTicket({ filter: {owner: account} }).on("data", update);
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (ticketBoughtListener) {
				ticketBoughtListener.removeAllListeners("data");
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticketMarket, account]);

	/* ---- Expose hook ----------------------------- */
	return wallet;
}

export default useTicketsWallet;
