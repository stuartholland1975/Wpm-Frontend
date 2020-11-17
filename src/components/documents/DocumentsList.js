import React from "react";
import { useSelector } from "react-redux";
import { GreyButton } from "../ui-components/Buttons";
import { selectAllDocuments } from "../../services/data/documentsData";

const DocumentImages = (props) => {
	const documents = useSelector(selectAllDocuments);
	

	return (
		<div>
			<ul>
				{ documents.map((item) => {
					const {document, document_title, id} = item;
					return <li key={ id }>
						<a href={ document } target="_blank" rel='noreferrer'>
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
