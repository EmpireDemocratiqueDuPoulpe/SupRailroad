import { useState, useEffect } from "react";
import { useMessages } from "../../contexts/MessageContext";
import { useEth } from "../../contexts/EthContext";

function useCardsWallet() {
	/* ---- Contexts -------------------------------- */
	const messages = useMessages();
	const { state: { account, contracts: {cardMarket} } } = useEth();

	/* ---- States ---------------------------------- */
	const [wallet, setWallet] = useState({});

	/* ---- Effects --------------------------------- */
	// Keep the wallet updated
	useEffect(() => {
		// Fetch the new wallet and update the hook state.
		const update = async () => {
			try {
				if (cardMarket) {
					// noinspection JSUnresolvedFunction
					setWallet({
						cards: await cardMarket.methods.getCards().call({ from: account }),
						approvedCards: await cardMarket.methods.getApprovals().call({ from: account })
					});
				}
			} catch (err) { messages.addError(err, true); }
		};

		// Fetch the wallet once and start an event listener.
		let cardBoughtListener = null;
		let cardApprovedListenerOut = null;
		let cardApprovedListenerIn = null;
		let cardTransferredListener = null;
		if (cardMarket) {
			update().catch(console.error);
			// noinspection JSValidateTypes
			cardBoughtListener = cardMarket.events.BoughtCard({ filter: {owner: account} }).on("data", update);
			// noinspection JSValidateTypes
			cardApprovedListenerOut = cardMarket.events.ApprovedCard({ filter: {owner: account} }).on("data", update);
			// noinspection JSValidateTypes
			cardApprovedListenerIn = cardMarket.events.ApprovedCard({ filter: {target: account} }).on("data", update);
			// noinspection JSValidateTypes
			cardTransferredListener = cardMarket.events.TransferredCard({ filter: {owner: account} }).on("data", update);
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (cardBoughtListener) cardBoughtListener.removeAllListeners("data");
			if (cardApprovedListenerOut) cardApprovedListenerOut.removeAllListeners("data");
			if (cardApprovedListenerIn) cardApprovedListenerIn.removeAllListeners("data");
			if (cardTransferredListener) cardTransferredListener.removeAllListeners("data");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardMarket, account]);

	/* ---- Expose hook ----------------------------- */
	return wallet;
}

export default useCardsWallet;
