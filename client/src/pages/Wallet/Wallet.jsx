import { useEth } from "../../contexts/EthContext";
import useWallet from "../../hooks/wallet/useWallet.js";
import Ticket from "../../components/Ticket/Ticket.jsx";

function Wallet() {
	/* ---- Contexts -------------------------------- */
	const { state: { account } } = useEth();
	const wallet = useWallet();

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page WalletPage">
			<Ticket name="Ticket" type="bus" points={[{ lat: 48.840056, long: 2.361997 }, { lat: 49.878677, long: 2.280633 }, { lat: 50.285914, long: 2.785091 }]}/>
			{/* TODO: Better message */}
			{!wallet ? <p>N/A</p> : (
				<>
					{!wallet.tickets.length ? <p>Vous ne possédez aucun ticket</p> : (
						<div>
							{wallet.tickets.map((ticket, idx) => <Ticket key={`ticket-${account}-${idx}`} {...ticket}/>)}
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default Wallet;
