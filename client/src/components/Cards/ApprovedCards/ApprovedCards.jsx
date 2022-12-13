import PropTypes from "prop-types";
import "./ApprovedCards.css";

function ApprovedCards({ children }) {
	/* ---- Page content ---------------------------- */
	return (
		<table className="approved-cards">
			<thead>
				<tr>
					<th>Nom</th>
					<th>Description</th>
					<th>R&eacute;duction</th>
					<th>Propriétaire</th>
					<th>Actions</th>
				</tr>
			</thead>

			<tbody>
				{children}
			</tbody>
		</table>
	);
}
ApprovedCards.propTypes = { children: PropTypes.node };

export { default as ApprovedCard } from "./ApprovedCard/ApprovedCard.jsx";
export default ApprovedCards;
