import React from "react";
import { useSelector } from "react-redux";
import { selectAllDocuments } from './documentsDataReducer';
import { GreyButton } from '../ui-components/Buttons';

const DocumentImages = (props) => {
	const documents = useSelector(selectAllDocuments);
	const selectedNode = useSelector(state => state.gridData)
	const modalDocuments = () => {
		if (selectedNode.length > 0) {
			return documents.filter(obj => obj.work_instruction === selectedNode[0].id)
		} else {
			return documents
		}
	}
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
