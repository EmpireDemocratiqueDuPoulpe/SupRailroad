import useTickets from "../../hooks/tickets/useTickets.js";
import Map from "../../components/Map/Map.jsx";

function TravelPlanner() {
	/* ---- Contexts -------------------------------- */
	const tickets = useTickets();

	/* ---- Functions ------------------------------- */
	const calcTicketPrice = async () => {
		tickets.requestPrice([{ lat: 48840056, long: 2361997 }, { lat: 49878677, long: 2280633 }, { lat: 50285914, long: 2785091 }]).catch(console.error);
	};

	const buyTicket = async () => {
		tickets.buy().catch(console.error);
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page TravelPlanner-page">
			<p>train | métro | bus</p>
			<Map/>
			<p>[&#123; lat: 48840056, long: 2361997 &#125;, &#123; lat: 49878677, long: 2280633 &#125;, &#123; lat: 50285914, long: 2785091 &#125;]</p>
			<button onClick={calcTicketPrice}>Calculer le prix</button>
			<button onClick={buyTicket} disabled={!tickets.currentPrice}>
				Acheter un ticket {tickets.currentPrice && <>({tickets.currentPrice} ETH)</>}
			</button>
		</div>
	);
}

export default TravelPlanner;
