import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";

function TicketDispenser() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, contract } } = useEth();

	/* ---- Functions ------------------------------- */
	const buyTicket = async () => {
		try {
			await contract.methods.buyTicket().send({ from: account, value: Web3.utils.toWei("0.001", "ether")});
		} catch (err) {
			// TODO: Error modal
			console.error(err);
		}
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="ticket-dispenser">
			<p>train | métro | bus</p>
			<button onClick={buyTicket}>Acheter un ticket (0.001 ETH)</button>
		</div>
	);
}

export default TicketDispenser;
