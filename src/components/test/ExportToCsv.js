import React from "react";
import { CSVLink } from "react-csv";
import { useSelector } from "react-redux";
import { selectAllWorkInstructions } from "../../services/data/InstructionData";


export const ExportToCsv = () => {

	const data = useSelector(selectAllWorkInstructions);

	return (
		<CSVLink data={ data } className="btn btn-primary"
		         target="_blank">
			DOWNLOAD ME
		</CSVLink>
	);

};