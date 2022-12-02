import PropTypes from "prop-types";
import "./Ticket.css";

function Ticket({ name, type, distance }) {
	return (
		<div className="ticket">
			<div className="ticket-inner">
				<div className="ticket-front">
					<div className="ticket-info">
						<p className="ticket-name ticket-info-line">{name}</p>
						<p className="ticket-distance ticket-info-line">{distance} km</p>
					</div>

					<div className="ticket-type">
						{type}
					</div>
				</div>

				<div className="ticket-back">

				</div>
			</div>
		</div>
	);
}
Ticket.propTypes = {
	name: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	distance: PropTypes.number.isRequired,
};

export default Ticket;