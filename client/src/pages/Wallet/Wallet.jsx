import { useEth } from "../../contexts/EthContext";
import useTicketsWallet from "../../hooks/wallet/useTicketsWallet.js";
import useCardsWallet from "../../hooks/wallet/useCardsWallet.js";
import Loader from "../../components/Loader/Loader.jsx";
import Ticket from "../../components/Ticket/Ticket.jsx";
import Card from "../../components/Card/Card.jsx";
import ApprovedCards, { ApprovedCard } from "../../components/ApprovedCards/ApprovedCards.jsx";
import "./Wallet.css";

function Wallet() {
	/* ---- Contexts -------------------------------- */
	const { state: { account } } = useEth();
	const ticketsWallet = useTicketsWallet();
	const cardsWallet = useCardsWallet();

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page Wallet-page">
			{(!ticketsWallet.tickets || !cardsWallet.cards || !cardsWallet.approvedCards) ? <Loader/> : (
				<>
					<div className="collection-box">
						<h2 className="collection-title">Tickets</h2>
						{!ticketsWallet.tickets?.length ? <p className="empty-collection">Vous ne possédez aucun ticket.</p> : (
							<div className="collection-content">
								{ticketsWallet.tickets.map((ticket, idx) => <Ticket key={`ticket-${account}-${idx}`} id={idx} {...ticket}/>)}
							</div>
						)}
					</div>

					<div className="collection-box">
						<h2 className="collection-title">Cartes de r&eacute;duction</h2>
						{!cardsWallet.cards?.length ? <p className="empty-collection">Vous ne possédez aucune carte de r&eacute;duction.</p> : (
							<div className="collection-content">
								{cardsWallet.cards.map((card, idx) => <Card key={`card-${account}-${idx}`} id={card.cardId} {...card}/>)}
							</div>
						)}
					</div>

					<div className="collection-box">
						<h2 className="collection-title">Cartes de r&eacute;duction approuvées</h2>
						{!cardsWallet.approvedCards?.length ? <p className="empty-collection">Vous ne possédez aucune carte de r&eacute;duction en attente de récupération.</p> : (
							<div className="collection-content">
								<ApprovedCards>
									{cardsWallet.approvedCards.map((approvedCard, idx) => (
										<ApprovedCard key={`approved-card-${account}-${idx}`}
											id={approvedCard.cardId}
											name={approvedCard.name}
											description={approvedCard.description}
											owner={approvedCard.owner}
											approvedTo={approvedCard.approvedTo}
											discount={approvedCard.discountPercent}/>
									))}
								</ApprovedCards>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default Wallet;
