import { useEth } from "../../contexts/EthContext";
import useWallet from "../../hooks/wallet/useWallet.js";
import useCardWallet from "../../hooks/wallet/useCardWallet.js";
import Loader from "../../components/Loader/Loader.jsx";
import Ticket from "../../components/Ticket/Ticket.jsx";
import Card from "../../components/Card/Card.jsx";
import "./Wallet.css";

function Wallet() {
	/* ---- Contexts -------------------------------- */
	const { state: { account } } = useEth();
	const wallet = useWallet();
	const cardWallet = useCardWallet();

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page Wallet-page">
			{!wallet ? <Loader/> : (
				<>
					<div className="collection-box">
						<h2 className="collection-title">Tickets</h2>
						{!wallet.tickets.length ? <p className="empty-collection">Vous ne possédez aucun ticket.</p> : (
							<div>
								{wallet.tickets.map((ticket, idx) => <Ticket key={`ticket-${account}-${idx}`} id={idx} types={["bus", "train", "subway"]} {...ticket}/>)}
							</div>
						)}
					</div>

					<div className="collection-box">
						<h2 className="collection-title">Cartes de r&eacute;duction</h2>
						{!cardWallet.cards?.length ? <p className="empty-collection">Vous ne possédez aucune carte de r&eacute;duction.</p> : (
							<div>
								{cardWallet.cards.map((card, idx) => <Card key={`card-${account}-${idx}`} id={idx} {...card}/>)}
							</div>
						)}
					</div>

					<div className="collection-box">
						<h2 className="collection-title">Cartes de r&eacute;duction approuvées</h2>
						{!cardWallet.approvedCards?.length ? <p className="empty-collection">Vous ne possédez aucune carte de r&eacute;duction en attente de récupération.</p> : (
							<div>
								{cardWallet.approvedCards.map((approvedCard, idx) => <Card key={`card-${account}-${idx}`} id={idx} {...approvedCard}/>)}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default Wallet;
