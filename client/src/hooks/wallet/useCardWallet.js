import { useState, useEffect } from "react";
import { useErrors } from "../../contexts/ErrorContext";
import { useEth } from "../../contexts/EthContext";

function useCardWallet() {
	/* ---- Contexts -------------------------------- */
	const errors = useErrors();
	const { state: { account, contracts: {cardFactory} } } = useEth();

	/* ---- States ---------------------------------- */
	const [wallet, setWallet] = useState({});

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		// Fetch the new wallet and update the hook state.
		const update = async () => {
			try {
				if (cardFactory) {
					const wallet = {
						cards: await cardFactory.methods.getCards().call({ from: account }),
						approvedCards: await cardFactory.methods.getUserApprovals().call({ from: account })
					};
					setWallet(wallet);
				}
			} catch (err) { errors.add(err, true); }
		};

		// Fetch the wallet once and start an event listener.
		let cardBoughtListener = null;
		if (cardFactory) {
			update().catch(console.error);
			// noinspection JSValidateTypes
			cardBoughtListener = cardFactory.events.BoughtCard({ filter: {owner: account} }).on("data", update);
		}

		// The event listener is stopped when this hook is unmounted.
		return () => {
			if (cardBoughtListener) {
				cardBoughtListener.removeAllListeners("data");
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardFactory, account]);

	/* ---- Expose hook ----------------------------- */
	return wallet;
}

export default useCardWallet;
