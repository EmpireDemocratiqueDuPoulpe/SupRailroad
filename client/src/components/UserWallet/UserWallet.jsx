import { useEth } from "../../contexts/EthContext";
import useWallet from "../../hooks/wallet/useWallet.js";

function UserWallet() {
	/* ---- Contexts -------------------------------- */
	const { state: { account } } = useEth();
	const wallet = useWallet();

	/* ---- Page content ---------------------------- */
	return (
		<div className="user-wallet">
			{/* TODO: Better message */}
			{!wallet ? <p>N/A</p> : (
				<>
					{!wallet.tickets.length ? <p>Vous ne possédez aucun ticket</p> : (
						<ul>
							{wallet.tickets.map((ticket, idx) => (
								<li key={`${account}-${idx}`}>{ticket.name}: [{ticket.origin.join(", ")}], [{ticket.destination.join(", ")}]</li>
							))}
						</ul>
					)}
				</>
			)}
		</div>
	);
}

export default UserWallet;
