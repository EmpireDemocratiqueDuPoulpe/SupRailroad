import { useMessages } from "../../contexts/MessageContext";
import { useEth } from "../../contexts/EthContext";
import {useEffect, useState} from "react";

function useMarket() {
	const messages = useMessages();
	const { state: { account, contracts: {cardMarket} } } = useEth();

	/* ---- States ---------------------------------- */
	const [onSaleCards, setOnSaleCards] = useState(/** @type {Array<Object>} */ []);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		const getAllOnSale = async () => {
			try {
				if (cardMarket) {
					// noinspection JSUnresolvedFunction
					const onSaleCards = await cardMarket.methods.getAllOnSale().call({ from: account });
					setOnSaleCards(onSaleCards);
				}
			} catch (err) { messages.addError(err, true); }
		};
		getAllOnSale().catch(console.error);
        
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cardMarket, account]);

	/* ---- Expose hook ----------------------------- */
	return { onSaleCards };
}

export default useMarket;
