import { Outlet, useNavigate } from "react-router-dom";
import "./Error.css";

function Error() {
	/* ---- Contexts -------------------------------- */
	const navigate = useNavigate();

	/* ---- Functions ------------------------------- */
	const goBack = () => {
		if (window.history.state && window.history.state.idx > 1) {
			navigate(-1);
		} else {
			navigate("/", { replace: true });
		}
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="App-root expand-all">
			<div className="App-body">
				<div className="Error-page">
					<div className="error-container">
						<button className="back-link" onClick={goBack}>&larr; Retour</button>

						<Outlet/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Error;
