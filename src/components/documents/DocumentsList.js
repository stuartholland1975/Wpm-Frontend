import React from "react";
import { useSelector } from "react-redux";
import { selectOrderSummaryDocuments } from "../../services/selectors";
import { GreyButton } from "../ui-components/Buttons";

const DocumentImages = (props) => {
	const documents = useSelector(selectOrderSummaryDocuments);

	return (
		<div>
			<ul>
				{ documents.length > 0 ? (
					documents.map((item) => {
						const {document, document_title, id} = item;
						return (
							<li key={ id }>
								<a href={ document } target="_blank" rel="noreferrer">
									{ document_title }
								</a>
							</li>
						);
					})
				) : (
					<p style={ {textAlign: "center", fontWeight: "bold"} }>
						No Documents Available for This Work Instruction
					</p>
				) }
			</ul>
			<hr/>
			<GreyButton fullWidth onClick={ props.handleHide }>
				Close
			</GreyButton>
		</div>
	);
};
export default DocumentImages;
