function Error403() {
	return (
		<div>
			<h1 className="error-title">Acc&egrave;s non autoris&eacute;.</h1>
			<p>Vous n&apos;avez pas la permission pour effectuer cette action.</p>
			<p className="error-code">403 - Forbidden</p>
		</div>
	);
}

export default Error403;
