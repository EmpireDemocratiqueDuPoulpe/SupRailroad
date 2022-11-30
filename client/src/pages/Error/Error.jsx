import { useRouteError } from "react-router-dom";

function Error() {
	/* ---- Contexts -------------------------------- */
	const error = useRouteError();

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page Error-page">
			<h1>Woopsy doopsy!</h1>
			<p>Our stoopid devs made a mistake.</p>
			<p>{error.statusText || error.message}</p>
		</div>
	);
}

export default Error;
