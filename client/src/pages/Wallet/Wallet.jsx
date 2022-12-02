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
			<Ticket id={1} name="Ticket" types={["bus", "train", "subway"]} distance={1700.5}/>
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
