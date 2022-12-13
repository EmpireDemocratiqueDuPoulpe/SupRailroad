import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { SimpleButton } from "../Buttons";
import "./InterfaceChecker.css";

function InterfaceChecker({ children }) {
	/* ---- Functions ------------------------------- */
	const reloadCurrent = () => window.location.reload();

	/* ---- Page content ---------------------------- */
	return (
		<div className="interface-checker expand-all">
			{window.ethereum ? children : (
				<div className="interface-checker-box">
					<h1 className="interface-checker-title">Attention</h1>

					<p className="interface-checker-message">Ce site nécessite l&apos;installation de l&apos;extension Metamask pour fonctionner.</p>
					<p className="interface-checker-sub-message">Ce n&apos;est pas une suggestion <span className="emojis">🔫🤠</span></p>

					<div className="interface-checker-actions">
						<a className="button simple-button interface-checker-metamask-link" href="https://metamask.io/" target="_blank" rel="noreferrer">
							Télécharger Metamask
							<FontAwesomeIcon icon={solid("frog")}/>
						</a>

						<SimpleButton className="interface-checker-reload-link" onClick={reloadCurrent}>
							J&apos;ai install&eacute; l&apos;extension
						</SimpleButton>
					</div>
				</div>
			)}
		</div>
	);
}
InterfaceChecker.propTypes = { children: PropTypes.node };

export default InterfaceChecker;
