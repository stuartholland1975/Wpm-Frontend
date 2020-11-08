import React from "react";
import { Modal } from "react-bootstrap";
import { connectModal } from "redux-modal";
import DocumentImages from "../documents/DocumentsList";
import InstructionForm from "../work-instructions/InstructionForm";
import LocationImages from "../images/LocationImages";
import { useHistory, useParams } from 'react-router-dom'
import LocationForm from "../locations/LocationForm";

const InstructionModal = (props) => {
	const {show, handleHide, title, content, formType} = props;
	const history = useHistory()
	const params = useParams()
//TODO FILTER DOCS AND IMAGES BY ORDER AND LOCATION
	const components = {
		instructionForm: <InstructionForm handleHide={ handleHide } formType={ formType }/>,
		documentsList: <DocumentImages handleHide={ handleHide }/>,
		locationImages: <LocationImages handleHide={ handleHide } sizeClass="d-block w-100"/>,
		locationForm: <LocationForm handleHide={ handleHide } formType= { formType }/>,
	};

	return (
		<div>
			<Modal
				show={ show }
				onHide={ handleHide }
				backdrop={ true }
				size="md"
				autoFocus={ false }
				centered={ false }
				scrollable={ false }
			>
				<Modal.Header
					closeButton
					style={ {backgroundColor: "hsl(180, 30%, 30%)", color: "white"} }
				>
					<Modal.Title style={ {textAlign: "center"} }>{ title }</Modal.Title>
				</Modal.Header>
				<Modal.Body>{ components[content] }</Modal.Body>
			</Modal>
		</div>
	);
};
export default connectModal({name: "instruction-modal"})(InstructionModal);
