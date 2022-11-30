import PropTypes from "prop-types";

function InterfaceChecker({ children }) {
	/* ---- Page content ---------------------------- */
	return (
		<div className="interface-checker">
			{window.ethereum ? children : (
				<div>
					<p>Vous n&apos;avez pas Metamask/Mist d&apos;installé.</p>
					<p>Installe 🔫😁</p>
				</div>
			)}
		</div>
	);
}
InterfaceChecker.propTypes = {
	children: PropTypes.node
};

export default InterfaceChecker;
