import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEth } from "../../contexts/EthContext";
import useTicketsMarket from "../../hooks/market/useTicketsMarket.js";
import useCardsMarket from "../../hooks/market/useCardsMarket.js";
import useContractBalance from "../../hooks/contractBalance/useContractBalance.js";
import Loader from "../../components/Loader/Loader.jsx";
import { PayableButton } from "../../components/Buttons";
import Inputs from "../../components/Inputs";

function AdminCorner() {
	/* ---- Contexts -------------------------------- */
	const navigate = useNavigate();
	const { state: { contracts: {ticketMarket, cardMarket}, account, isAdmin } } = useEth();
	const ticketsMarket = useTicketsMarket();
	const cardsMarket = useCardsMarket();
	const ticketsContractBalance = useContractBalance(ticketMarket);
	const cardsContractBalance = useContractBalance(cardMarket);

	/* ---- Constants ------------------------------- */
	const [cardName, setCardName] = useState(/** @type {string} */ "");
	const [cardDescription, setCardDescription] = useState(/** @type {string} */ "");
	const [cardImage, setCardImage] = useState(/** @type {string} */ "");
	const [cardPrice, setCardPrice] = useState(/** @type {string} */ "");
	const [cardDiscount, setCardDiscount] = useState(/** @type {number} */ "");
	const [cardsCount, setCardsCount] = useState(/** @type {number} */ "");

	/* ---- Functions ------------------------------- */
	/* ┌─────────New card form functions─────────┐ */

	const handleCardName = event => {
		setCardName(event.target.value);
	};

	const handleCardDescription = event => {
		setCardDescription(event.target.value);
	};

	const handleCardImage = event => {
		setCardImage(event.target.value);
	};

	const handleCardPrice = event => {
		setCardPrice(event.target.value.toString());
	};

	const handleCardDiscount = event => {
		setCardDiscount(event.target.value);
	};

	const handleCardsNumber = event => {
		setCardsCount(event.target.value);
	};

	/* └─────────────────────────────────────────┘ */

	const onPriceChange = price => ticketsMarket.setStandardPrice(price).catch(console.error);

	const createCard = () => {
		cardsMarket.create(cardPrice, cardDiscount, cardName, cardImage, cardDescription, cardsCount).catch(console.error);
	};

	const transfertBalance = contractBalance => contractBalance.transfert(account).catch(console.error);

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
						<span>Nom :</span><input type="text" minLength="1" placeholder="Nom de la carte" value={cardName} onChange={handleCardName}/><br/>
						<span>Description :</span><input type="text" placeholder="Description de la carte" value={cardDescription} onChange={handleCardDescription}/><br/>
						<span>Image (url) :</span><input type="text" placeholder="Image de la carte" value={cardImage} onChange={handleCardImage}/><br/>
						<span>Prix (ETH) :</span><input type="number" step="0.0001" placeholder="Prix de la carte" value={cardPrice} onChange={handleCardPrice}/><br/>
						<span>Réduction (%) :</span><input type="number" step="1" min="1" max="100" placeholder="Pourcentage de réduction" value={cardDiscount} onChange={handleCardDiscount}/><br/>
						<span>Nombre :</span><input type="number" step="1" min="1" max="100" placeholder="Nombre de cartes" value={cardsCount} onChange={handleCardsNumber}/><br/>

						<PayableButton onClick={createCard}>
							Cr&eacute;er {cardsCount > 1 ? "les" : "la"} carte{cardsCount > 1 ? "s" : ""}
						</PayableButton>
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
