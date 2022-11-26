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

	const buyTicket = async () => {
		try {
			await contract.methods.buyTicket().send({ from: account, value: ticketPrice.price});
		} catch (err) {
			// TODO: Error modal
			console.error(err);
		}
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="ticket-dispenser">
			<p>train | métro | bus</p>
			<button onClick={buyTicket} disabled={!ticketPrice.price}>
				Acheter un ticket {ticketPrice.price && <>({Web3.utils.fromWei(ticketPrice.price, "ether")} ETH)</>}
			</button>

			<p>[================]</p>

			<input type="number" step=".001" value={newPrice} onChange={e => setNewPrice(e.target.value)} disabled={!ticketPrice.price}/>
			<button onClick={updatePrice} disabled={!newPrice}>Modifier le prix 🤑</button>
		</div>
	);
}

export default TicketDispenser;
