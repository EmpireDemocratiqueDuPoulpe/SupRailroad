import { useNavigate, useRouteError } from "react-router-dom";
import { eventOnElement } from "../../helpers/accessibility.js";
import BonkImage from "../../assets/images/bonk.png";
import BonkSound from "../../assets/sounds/bonk.mp3";
import "./ErrorPage.css";

// Constants
const bonkSound = new Audio(BonkSound);

// Page
function ErrorPage() {
	/* ---- Contexts -------------------------------- */
	const navigate = useNavigate();
	const error = useRouteError();

	/* ---- Functions ------------------------------- */
	const goBack = () => {
		if (window.history.state && window.history.state.idx > 1) {
			navigate(-1);
		} else {
			navigate("/", { replace: true });
		}
	};

	const playBonk = () => { bonkSound.cloneNode(true).play().catch(console.error); };

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page Error-page">
			<div className="error-container">
				<button className="back-link" onClick={goBack}>&larr; Retour</button>

				<h1 className="error-title">Woopsy doopsy!</h1>
				<p>Our stoopid devs made a mistake.</p>
				<p className="error-code">{error.status} - {error.statusText || error.message}</p>
				<img className="bonk-dev" src={BonkImage} alt="bonk time!" {...eventOnElement(playBonk)}/>
			</div>
		</div>
	);
}

export default ErrorPage;
