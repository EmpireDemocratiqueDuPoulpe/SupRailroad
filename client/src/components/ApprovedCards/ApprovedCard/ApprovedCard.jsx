import PropTypes from "prop-types";
import useCards from "../../../hooks/cards/useCards.js";

function ApprovedCard({ id, name, description, discount, approvedTo, from }) {
	/* ---- States ---------------------------------- */
	const cards = useCards();

	/* ---- Functions ------------------------------- */
	const confirmRetrieval = () => cards.retrieve(from, approvedTo, id).catch(console.error);

	/* ---- Page content ---------------------------- */
	return (
		<div className="approved-card">
			<p>ID : {id}</p>
			<p>NAME : {name}</p>
			<p>DESCRIPTION : {description}</p>
			<p>DISCOUNT : {discount}</p>
			<p>ACTUAL OWNER (from) : {from}</p>
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
	from: PropTypes.string.isRequired
};

export default ApprovedCard;
