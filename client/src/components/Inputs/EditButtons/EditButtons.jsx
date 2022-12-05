import PropTypes from "prop-types";
import IconButton from "../IconButton/IconButton.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { eventOnElement } from "../../../helpers/accessibility.js";
import "./EditButtons.css";

function EditButtons({ editing, onEdit, onCloseSave, onCloseErase }) {
	/* ---- Page content ---------------------------- */
	return (
		<div className="input-edit">
			{!editing ? (
				<IconButton type="positive" {...eventOnElement(onEdit)}>
					<FontAwesomeIcon icon={solid("pencil")}/>
				</IconButton>
			) : (
				<>
					<IconButton type="positive" {...eventOnElement(onCloseSave)}>
						<FontAwesomeIcon icon={solid("check")}/>
					</IconButton>

					<IconButton type="negative" {...eventOnElement(onCloseErase)}>
						<FontAwesomeIcon icon={solid("xmark")}/>
					</IconButton>
				</>
			)}
		</div>
	);
}
EditButtons.propTypes = {
	editing: PropTypes.bool.isRequired,
	onEdit: PropTypes.func.isRequired,
	onCloseSave: PropTypes.func.isRequired,
	onCloseErase: PropTypes.func.isRequired
};

export default EditButtons;
