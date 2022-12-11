import { useState } from "react";
import PropTypes from "prop-types";
import MessageContext from "./MessageContext.js";
import MessageBox from "./MessageBox/MessageBox.jsx";
import "./MessageProvider.css";

/**
 * @typedef {Object} MessageObj
 * @property {number} id - Message id.
 * @property {number} [code] - Message code.
 * @property {string} message - Message content.
 * @property {"error"|"warn"|"info"|"success"} type - Message type.
 */

function MessageProvider({ limit, children }) {
	/* ---- States ---------------------------------- */
	const [messages, setMessages] = useState(/** @type {Array<MessageObj>} */ []);

	/* ---- Functions ------------------------------- */
	const addMessage = (message, type, code = null, ttl = null) => {
		setMessages(prevState => [...prevState, { id: prevState.length, message, type, code, ttl }]);
	};

	const addSuccess = (message, code = null) => addMessage(message, "success", code, 2500);
	const addInfo = (message, code = null) => addMessage(message, "info", code, 2500);
	const addWarn = (message, code = null) => addMessage(message, "warn", code);
	const addError = (err, rpc = false) => {
		if (rpc) {
			const parsedErr = getRPCError(err);
			addMessage(parsedErr.data.reason, "error", parsedErr.code);
		} else {
			addMessage(err.message, "error", err.code);
		}
	};

	const getRPCError = err => {
		try {
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
		} catch (parseErr) {
			console.error(`Cannot parse the RPC error (${parseErr.message}):\n${err}`);
			return { code: -1, data: {reason: `${err}`} };
		}
	};

	const del = messageId => {
		setMessages(prevState => prevState.filter(m => m.id !== messageId));
	};

	/* ---- Page content ---------------------------- */
	return (
		<MessageContext.Provider value={{ addSuccess, addInfo, addWarn, addError, delete: del }}>
			<div className="messages-wrapper">
				{messages.slice(-limit).map((message => (
					<MessageBox key={`error-${message.id}`} {...message} onClose={() => del(message.id)}/>
				)))}
			</div>
			{children}
		</MessageContext.Provider>
	);
}
MessageProvider.propTypes = {
	limit: PropTypes.number,
	children: PropTypes.node
};
MessageProvider.defaultProps = { limit: 3 };

export default MessageProvider;
