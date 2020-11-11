import React from "react";
import { useSelector } from "react-redux";
import { GreyButton } from "../ui-components/Buttons";
import { selectAllDocuments } from "./documentsDataReducer";

const DocumentImages = (props) => {
	const documents = useSelector(selectAllDocuments);
	const selectedInstruction = useSelector(state => state.gridData.selectedRow.id);
	const modalDocuments = documents.filter(obj => obj.work_instruction === selectedInstruction);

	return (
		<div>
			<ul>
				{ modalDocuments.map((item) => {
					const {document, document_title, id} = item;
					return <li key={ id }>
						<a href={ document } target="_blank">
							{ document_title }
						</a>
					</li>;
				}) }
			</ul>
			<hr/>
			<GreyButton fullWidth onClick={ props.handleHide }>Close</GreyButton>
		</div>
	);
};
export default DocumentImages;
