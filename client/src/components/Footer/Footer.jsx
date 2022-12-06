import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Footer.css";

const messages = [
	"Vends cheminot, très peu servi, quarante ans d'expérience, prix à débattre.",
	"Installez Instabus et partagez vos meilleures photos d'abribus !",
	"Envie d'un jet privé ? Démarrez une école d'informatique !",
	"Pour des raisons géopolitiques, le prix du ticket a été ajusté de 9 431 %."
];
const getRandomId = () => Math.floor(Math.random() * messages.length);

function Footer() {
	/* ---- Contexts -------------------------------- */
	const location = useLocation();

	/* ---- States ---------------------------------- */
	const [messageId, setMessageId] = useState(getRandomId());

	/* ---- Effects --------------------------------- */
	useEffect(() => { setMessageId(getRandomId()); }, [location.pathname]);

	/* ---- Page content ---------------------------- */
	return (
		<div className="footer">
			<span className="footer-content">{messages[messageId]} - Made in d&eacute;centralis&eacute;™.</span>
		</div>
	);
}

export default Footer;
