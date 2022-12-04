import { useState, useEffect } from "react";
import useTickets from "../../hooks/tickets/useTickets.js";
import Inputs from "../../components/Inputs";
import "./AdminCorner.css";

function AdminCorner() {
	/* ---- Contexts -------------------------------- */
	const tickets = useTickets();

	/* ---- States ---------------------------------- */
	const [newPrice, setNewPrice] = useState(/** @type {string} */ "");

	/* ---- Functions ------------------------------- */
	// noinspection JSUnusedLocalSymbols
	// eslint-disable-next-line no-unused-vars
	const updatePrice = () => {
		tickets.setStandardPrice(newPrice).catch(console.error);
	};

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		if (!newPrice && tickets.standardPrice) {
			setNewPrice(tickets.standardPrice.toString());
		}
	}, [newPrice, tickets.standardPrice]);

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page AdminCorner-page">
			<div className="inner-page">
				<div className="inner-page-section">
					<h2 className="inner-page-section-title">Tarification</h2>

					<Inputs.Number
						label="Prix du ticket (par km) :" postLabel="ETH"
						step={0.0001}
						value={newPrice} onChange={p => setNewPrice(p)}
						disabled={!tickets.standardPrice}
					/>
					<Inputs.Checkbox label="Gagner un max d'argent" checked readOnly/>
				</div>

				<div className="inner-page-section">
					<h2 className="inner-page-section-title">Cartes de r&eacute;duction</h2>

					&Agrave; faire.
				</div>
			</div>
		</div>
	);
}

export default AdminCorner;
