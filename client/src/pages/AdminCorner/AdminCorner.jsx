import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";
import useTickets from "../../hooks/tickets/useTickets.js";
import useCards from "../../hooks/cards/useCards.js";
import useContractBalance from "../../hooks/contractBalance/useContractBalance.js";
import Loader from "../../components/Loader/Loader.jsx";
import Inputs from "../../components/Inputs";

function AdminCorner() {
	/* ---- Contexts -------------------------------- */
	const navigate = useNavigate();
	const { state: { contracts: {ticketFactory}, account, isAdmin } } = useEth();
	const tickets = useTickets();
	const cards = useCards();
	const contractBalance = useContractBalance(ticketFactory);

	/* ---- Functions ------------------------------- */
	const onPriceChange = price => {
		tickets.setStandardPrice(price).catch(console.error);
	};

	const createCard = () => {
		cards.create(Web3.utils.toWei("0.015", "ether"), 20, "Test card", "image_path", "Test card description").catch(console.error);
	};

	const transfertBalance = () => {
		contractBalance.transfert(account).catch(console.error);
	};

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
							defaultValue={tickets.standardPrice?.toString()} onChange={onPriceChange}
							disabled={!tickets.standardPrice}
						/>
						<Inputs.Checkbox label="Gagner un max d'argent" checked readOnly/>
					</div>
				</div>

				<div className="inner-page-section">
					<h2 className="inner-page-section-title">Cartes de r&eacute;duction</h2>

					<div className="inner-page-section-body">
						<button onClick={createCard}>Create card</button>
					</div>
				</div>

				<div className="inner-page-section">
					<h2 className="inner-page-section-title">Transfert de fonds</h2>

					<div className="inner-page-section-body">
						{!contractBalance.loaded ? <Loader centered/> : (
							<>
								<p className="inner-page-section-data">Balance : {contractBalance.balance} ETH</p>

								<button onClick={transfertBalance} disabled={!contractBalance.balance}>Transférer sur mon compte</button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default AdminCorner;
