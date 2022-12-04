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
			{/* TODO: Better message */}
			{!wallet ? <p>N/A</p> : (
				<>
					{!wallet.tickets.length ? <p>Vous ne possédez aucun ticket</p> : (
						<div>
							{wallet.tickets.map((ticket, idx) => <Ticket key={`ticket-${account}-${idx}`} id={idx} types={["bus", "train", "subway"]} {...ticket}/>)}
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default Wallet;
