import { useState } from "react";
import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";
import useTicketPrice from "../../hooks/ticketPrice/useTicketPrice.js";

function TicketDispenser() {
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
		await ticketPrice.get({lat: 46901492, long: 3583934}, {lat: 43177141, long: 2528543});
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
		<div className="ticket-dispenser">
			<p>train | métro | bus</p>
			<p>De: [46901492, 3583934] à [43177141, 2528543]</p>
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

export default TicketDispenser;
