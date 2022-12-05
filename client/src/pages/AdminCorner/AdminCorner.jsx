import useTickets from "../../hooks/tickets/useTickets.js";
import Inputs from "../../components/Inputs";
import "./AdminCorner.css";

function AdminCorner() {
	/* ---- Contexts -------------------------------- */
	const tickets = useTickets();

	/* ---- Functions ------------------------------- */
	const onPriceChange = price => {
		tickets.setStandardPrice(price).catch(console.error);
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page AdminCorner-page">
			<div className="inner-page">
				<div className="inner-page-section">
					<h2 className="inner-page-section-title">Tarification</h2>

					<Inputs.Number
						label="Prix du ticket (par km) :" postLabel="ETH"
						step={0.0001}
						defaultValue={tickets.standardPrice?.toString()} onChange={onPriceChange}
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
