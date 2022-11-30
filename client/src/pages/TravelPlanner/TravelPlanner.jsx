import { useState } from "react";
import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";
import useTicketPrice from "../../hooks/ticketPrice/useTicketPrice.js";
import Map from "../../components/Map/Map.jsx";

function TravelPlanner() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, contract } } = useEth();
	const ticketPrice = useTicketPrice();

	/* ---- States ---------------------------------- */
	const [newPrice, setNewPrice] = useState(/** @type {string} */ "");

	/* ---- Functions ------------------------------- */
	const updatePrice = () => {
		ticketPrice.set(newPrice).catch(console.error);
	};

	const calcTicketPrice = async () => {
		await ticketPrice.get([{ lat: 48840056, long: 2361997 }, { lat: 49878677, long: 2280633 }, { lat: 50285914, long: 2785091 }]);
	};

	const buyTicket = async () => {
		try {
			await contract.methods.buyTicket({lat: 46901492, long: 3583934}, {lat: 43177141, long: 2528543})
				.send({ from: account, value: ticketPrice.price});
		} catch (err) {
			// TODO: Error modal
			console.error(err);
		}
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page TravelPlannerPage">
			<p>train | métro | bus</p>
			<Map/>
			<p>[&#123; lat: 48840056, long: 2361997 &#125;, &#123; lat: 49878677, long: 2280633 &#125;, &#123; lat: 50285914, long: 2785091 &#125;]</p>
			<button onClick={calcTicketPrice}>Calculer le prix</button>
			<button onClick={buyTicket} disabled={!ticketPrice.price}>
				Acheter un ticket {ticketPrice.price && <>({Web3.utils.fromWei(ticketPrice.price, "ether")} ETH)</>}
			</button>

			<p>[================]</p>

			<input type="number" step=".001" value={newPrice} onChange={e => setNewPrice(e.target.value)} disabled={!ticketPrice.standardPrice}/>
			<button onClick={updatePrice} disabled={!newPrice}>Modifier le prix 🤑</button>
		</div>
	);
}

export default TravelPlanner;
