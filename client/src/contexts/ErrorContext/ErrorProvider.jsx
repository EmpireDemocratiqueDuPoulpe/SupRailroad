import {useState} from "react";
import PropTypes from "prop-types";
import ErrorContext from "./ErrorContext.js";
import ErrorBox from "./ErrorBox/ErrorBox.jsx";
import { NotImplemented } from "../../helpers/customErrors.js";
import "./ErrorProvider.css";

/**
 * @typedef {Object} ErrObj
 * @property {number} id - Error id.
 * @property {number} [code] - Error code.
 * @property {string} message - Error message.
 */

function ErrorProvider({ limit, children }) {
	/* ---- States ---------------------------------- */
	const [errors, setErrors] = useState(/** @type {Array<ErrObj>} */ []);

	/* ---- Functions ------------------------------- */
	const addError = (err, rpc = false) => {
		if (rpc) {
			const parsedErr = getRPCError(err);
			setErrors(prevState => [...prevState, { id: prevState.length, code: parsedErr.code, message: parsedErr.data.reason }]);
		} else {
			throw new NotImplemented("Non-RPC error handling");
		}
	};

	const getRPCError = err => {
		// Parse the RPC string
		const openPos = err.stack.indexOf("{");
		const closePos = err.stack.lastIndexOf("}");
		const parsedJSON = JSON.parse(err.stack.substring(openPos, closePos + 1));

		// Flatten the data object
		let data = {};
		Object.entries(parsedJSON.data).forEach(([k, v]) => {
			if (Object.prototype.hasOwnProperty.call(v, "reason")) {
				data = { ...data, ...v };
			} else data[k] = v;
		});
		parsedJSON.data = data;

		// Return the parsed error
		return parsedJSON;
	};

	const delError = errId => {
		setErrors(prevState => prevState.filter(e => e.id !== errId));
	};

	/* ---- Page content ---------------------------- */
	return (
		<ErrorContext.Provider value={{ add: addError, delete: delError }}>
			<div className="errors-wrapper">
				{errors.slice(-limit).map((err => (
					<ErrorBox key={`error-${err.id}`} id={err.id} code={err.code} message={err.message} onClose={() => delError(err.id)}/>
				)))}
			</div>
			{children}
		</ErrorContext.Provider>
	);
}
ErrorProvider.propTypes = {
	limit: PropTypes.number,
	children: PropTypes.node
};
ErrorProvider.defaultProps = { limit: 3 };

export default ErrorProvider;
