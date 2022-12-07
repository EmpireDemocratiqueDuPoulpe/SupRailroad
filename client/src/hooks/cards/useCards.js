import { useErrors } from "../../contexts/ErrorContext";
import { useEth } from "../../contexts/EthContext";

function useCards() {
	const errors = useErrors();
	const { state: { account, contracts: {cardFactory} } } = useEth();

	const createCard = async (price, discountPercent, name, imageURI, description) => {
		try {
			if (cardFactory) {
				// noinspection JSUnresolvedFunction
				await cardFactory.methods.createCard(price, discountPercent, name, imageURI, description).send({ from: account });
			}
		} catch (err) { errors.add(err, true); }
	};

	return { create: createCard };
}

export default useCards;
