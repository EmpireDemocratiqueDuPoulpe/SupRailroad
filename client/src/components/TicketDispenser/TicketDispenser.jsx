import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";
import useTicketPrice from "../../hooks/ticketPrice/useTicketPrice.js";

function TicketDispenser() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, contract } } = useEth();
	const ticketPrice = useTicketPrice();

	/* ---- Functions ------------------------------- */
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
		</div>
	);
}

export default TicketDispenser;
