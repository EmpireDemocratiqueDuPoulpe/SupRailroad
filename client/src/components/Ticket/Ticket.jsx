import PropTypes from "prop-types";
import "./Ticket.css";

function Ticket({ name, type }) {
	return (
		<div className="ticket">
			<p className="ticket-name">{name}</p>

			<div className="ticket-type">
				{type}
			</div>
		</div>
	);
}
Ticket.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	points: PropTypes.arrayOf(
		PropTypes.shape({
			lat: PropTypes.number,
			long: PropTypes.number,
		})
	).isRequired,
};

export default Ticket;