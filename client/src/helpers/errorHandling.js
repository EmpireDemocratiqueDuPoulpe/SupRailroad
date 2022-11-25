const del = "#";
const errCodeLen = 6;
export const errCodes = {
	WALLET_NOT_FOUND: `${del}WAL001`,
	WALLET_ALREADY_EXISTS: `${del}WAL002`
};

export function getRPCError(err) {
	// Parse the RPC string
	const openPos = err.stack.indexOf("{");
	const closePos = err.stack.lastIndexOf("}");

	const rpcErr = JSON.parse(err.stack.substring(openPos, closePos + 1));

	// Get the error code
	let errCode = null;
	const errCodePos = rpcErr.data.reason.indexOf(del);
	if (errCodePos) {
		errCode = rpcErr.data.reason.substring(errCodePos, errCodeLen + 1);
	}

	rpcErr.errCode = errCode;

	// Return the parsed error
	return rpcErr;
}
