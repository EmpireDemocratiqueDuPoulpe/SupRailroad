import PropTypes from "prop-types";
import useCardsMarket from "../../../../hooks/market/useCardsMarket.js";
import "./ApprovedCard.css";

function ApprovedCard({ id, name, description, discount, approvedTo, owner }) {
	/* ---- States ---------------------------------- */
	const cardsMarket = useCardsMarket(false);

	/* ---- Functions ------------------------------- */
	const confirmRetrieval = () => cardsMarket.retrieveApproved(owner, approvedTo, id).catch(console.error);

	/* ---- Page content ---------------------------- */
	return (
		<tr className="approved-card">
			<td className="approved-card-name">{name}</td>
			<td className="approved-card-description">{description}</td>
			<td className="approved-card-discount">{discount} %</td>
			<td className="approved-card-owner">{owner}</td>
			<td className="approved-card-actions"><button onClick={confirmRetrieval}>Récupérer</button></td>
		</tr>
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
