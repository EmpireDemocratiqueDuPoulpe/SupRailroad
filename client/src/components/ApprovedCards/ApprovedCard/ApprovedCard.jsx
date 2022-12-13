import PropTypes from "prop-types";
import useCardsMarket from "../../../hooks/market/useCardsMarket.js";

function ApprovedCard({ id, name, description, discount, approvedTo, owner }) {
	/* ---- States ---------------------------------- */
	const cardsMarket = useCardsMarket(false);

	/* ---- Functions ------------------------------- */
	const confirmRetrieval = () => cardsMarket.retrieveApproved(owner, approvedTo, id).catch(console.error);

	/* ---- Page content ---------------------------- */
	return (
		<div className="approved-card">
			<p>ID : {id}</p>
			<p>NAME : {name}</p>
			<p>DESCRIPTION : {description}</p>
			<p>DISCOUNT : {discount}</p>
			<p>ACTUAL OWNER (from) : {owner}</p>
			<button onClick={confirmRetrieval}>Récupérer</button>
		</div>
	);
}
ApprovedCard.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string,
	discount: PropTypes.string.isRequired,
	approvedTo: PropTypes.string.isRequired,
	owner: PropTypes.string.isRequired
};

export default ApprovedCard;
