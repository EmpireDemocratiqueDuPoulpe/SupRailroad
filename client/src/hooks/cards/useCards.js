import { useErrors } from "../../contexts/ErrorContext";
import { useEth } from "../../contexts/EthContext";

function useCards() {
	const errors = useErrors();
	const { state: { account, contracts: {cardMarket} } } = useEth();

	const createCard = async (price, discountPercent, name, imageURI, description) => {
		try {
			if (cardMarket) {
				// noinspection JSUnresolvedFunction
				await cardMarket.methods.createCard(price, discountPercent, name, imageURI, description).send({ from: account });
			}
		} catch (err) { errors.add(err, true); }
	};

	const approveCard = async (target, cardId) => {
		try {
			if (cardMarket) {
				// noinspection JSUnresolvedFunction
				await cardMarket.methods.setApproval(target, cardId).send({ from: account });
			}
		} catch (err) { errors.add(err, true); }
	};

	const retrieveCard = async (owner, target, cardId) => {
		try {
			if (cardMarket) {
				// noinspection JSUnresolvedFunction
				await cardMarket.methods.transferCard(owner, target, cardId).send({ from: account });
			}
		} catch (err) { errors.add(err, true); }
	};

	return { create: createCard, approve: approveCard, retrieve: retrieveCard };
}

export default useCards;
