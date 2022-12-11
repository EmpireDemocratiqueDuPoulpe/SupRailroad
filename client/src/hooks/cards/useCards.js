import { useMessages } from "../../contexts/MessageContext";
import { useEth } from "../../contexts/EthContext";

function useCards() {
	const messages = useMessages();
	const { state: { account, contracts: {cardMarket} } } = useEth();

	const createCard = async (price, discountPercent, name, imageURI, description, number) => {
		try {
			if (cardMarket) {
				// noinspection JSUnresolvedFunction
				await cardMarket.methods.createCard(price, discountPercent, name, imageURI, description, number).send({ from: account });
			}
		} catch (err) { messages.addError(err, true); }
	};

	const approveCard = async (target, cardId) => {
		try {
			if (cardMarket) {
				// noinspection JSUnresolvedFunction
				await cardMarket.methods.setApproval(target, cardId).send({ from: account });
			}
		} catch (err) { messages.addError(err, true); }
	};

	const retrieveCard = async (owner, target, cardId) => {
		try {
			if (cardMarket) {
				// noinspection JSUnresolvedFunction
				await cardMarket.methods.transferCard(owner, target, cardId).send({ from: account });
			}
		} catch (err) { messages.addError(err, true); }
	};

	return { create: createCard, approve: approveCard, retrieve: retrieveCard };
}

export default useCards;
