import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMessages } from "../../contexts/MessageContext";
import { useEth } from "../../contexts/EthContext";
import useTicketsMarket from "../../hooks/market/useTicketsMarket.js";
import useCardsMarket from "../../hooks/market/useCardsMarket.js";
import useContractBalance from "../../hooks/contractBalance/useContractBalance.js";
import Loader from "../../components/Loader/Loader.jsx";
import { PayableButton } from "../../components/Buttons";
import Inputs from "../../components/Inputs";
import "./AdminCorner.css";

function AdminCorner() {
	/* ---- Contexts - Part one --------------------- */
	const navigate = useNavigate();
	const messages = useMessages();
	const { state: { contracts: {ticketMarket, cardMarket}, account, isAdmin } } = useEth();
	const ticketsMarket = useTicketsMarket();
	const ticketsContractBalance = useContractBalance(ticketMarket);
	const cardsContractBalance = useContractBalance(cardMarket);

	/* ---- States ---------------------------------- */
	const [cardName, setCardName] = useState(/** @type {string} */ "");
	const [cardDescription, setCardDescription] = useState(/** @type {string} */ "");
	const [cardImage, setCardImage] = useState(/** @type {string} */ "");
	const [cardPrice, setCardPrice] = useState(/** @type {string} */ "");
	const [cardDiscount, setCardDiscount] = useState(/** @type {string} */ "");
	const [cardCount, setCardCount] = useState(/** @type {string} */ "");

	/* ---- Functions ------------------------------- */
	const onCardNameChange = event => setCardName(event.target.value);
	const onCardDescriptionChange = event => setCardDescription(event.target.value);
	const onCardImageChange = event => setCardImage(event.target.value);
	const onCardPriceChange = event => setCardPrice(event.target.value);
	const onCardDiscountChange = event => setCardDiscount(event.target.value);
	const onCardCountChange = event => setCardCount(event.target.value);
	const resetCardForm = () => {
		setCardName("");
		setCardDescription("");
		setCardImage("");
		setCardPrice("");
		setCardDiscount("");
		setCardCount("");
	};
	const isCardValid = () => cardName && cardPrice && cardDiscount && cardCount;
	const createCard = () => cardsMarket.create(cardPrice, cardDiscount, cardName, cardImage, cardDescription.trim(), cardCount).catch(console.error);
	const onCardCreated = () => {
		messages.addSuccess("Carte de réduction créées.");
		resetCardForm();
	};

	const onPriceChange = price => ticketsMarket.setStandardPrice(price).catch(console.error);

	const transfertBalance = contractBalance => contractBalance.transfert(account).catch(console.error);

	/* ---- Contexts - Part two --------------------- */
	const cardsMarket = useCardsMarket({ onCardCreated, fetchCards: false });

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		const redirectUnauthorized = () => {
			if (!isAdmin) {
				navigate("/error/403");
			}
		};

		redirectUnauthorized();
	}, [isAdmin, navigate]);

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page AdminCorner-page">
			<div className="inner-page">
				<div className="inner-page-section">
					<h2 className="inner-page-section-title">Tarification</h2>

					<div className="inner-page-section-body">
						<Inputs.Number
							label="Prix du ticket (par km) :" postLabel="ETH"
							step={0.0001}
							defaultValue={ticketsMarket.standardPrice?.toString()} onChange={onPriceChange}
							disabled={!ticketsMarket.standardPrice}
						/>
						<Inputs.Checkbox label="Gagner un max d'argent" checked readOnly/>
					</div>
				</div>

				<div className="inner-page-section">
					<h2 className="inner-page-section-title">Cartes de r&eacute;duction</h2>

					<div className="inner-page-section-body">
						<div className="new-card-form">
							<div className="new-card-form-row">
								<label className="input">
									Nom* :
									<input type="text" minLength="1" placeholder="Carte de réduction" value={cardName} onChange={onCardNameChange}/>
								</label>

								<label className="input">
									Image (url) :
									<input type="text" placeholder="https://i.imgur.com/oXg3WVS.png" value={cardImage} onChange={onCardImageChange}/>
								</label>
							</div>

							<div className="new-card-form-row">
								<label className="input column">
									Description :
									<textarea placeholder="Payez cette carte pour payer moins cher ! Attendez ... je ... euh non c'est ça." value={cardDescription} onChange={onCardDescriptionChange}/>
								</label>
							</div>

							<div className="new-card-form-row">
								<label className="input">
									Prix* (ETH) :
									<input type="number" step="0.01" placeholder="0.030" value={cardPrice} onChange={onCardPriceChange}/>
								</label>

								<label className="input">
									Réduction* (%) :
									<input type="number" step="1" min="1" max="100" placeholder="10" value={cardDiscount} onChange={onCardDiscountChange}/>
								</label>
							</div>

							<div className="new-card-form-row">
								<div className="spacer"/>

								<label className="input">
									Nombre de carte* :
									<input type="number" step="1" min="1" max="100" placeholder="pas trop stp, sinon ça lag" value={cardCount} onChange={onCardCountChange}/>
								</label>

								<div className="spacer"/>
							</div>

							<PayableButton onClick={createCard} disabled={!isCardValid()}>
								Cr&eacute;er {cardCount > 1 ? "les" : "la"} carte{cardCount > 1 ? "s" : ""}
							</PayableButton>
						</div>
					</div>
				</div>

				<div className="inner-page-section">
					<h2 className="inner-page-section-title">Transfert de fonds</h2>

					<div className="inner-page-section-body">
						{(!ticketsContractBalance.loaded || !cardsContractBalance.loaded) ? <Loader centered/> : (
							<div className="balances-group">
								<div className="balance-box">
									<h3>March&eacute; des tickets</h3>
									<p className="inner-page-section-data">Balance : {ticketsContractBalance.balance} ETH</p>

									<PayableButton onClick={() => transfertBalance(ticketsContractBalance)} disabled={!ticketsContractBalance.balance}>
										Transférer sur mon compte
									</PayableButton>
								</div>

								<div className="balance-box">
									<h3>March&eacute; des cartes de r&eacute;duction</h3>
									<p className="inner-page-section-data">Balance : {cardsContractBalance.balance} ETH</p>

									<PayableButton onClick={() => transfertBalance(cardsContractBalance)} disabled={!cardsContractBalance.balance}>
										Transférer sur mon compte
									</PayableButton>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminCorner;
