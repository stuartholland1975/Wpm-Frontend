import React, { Fragment } from "react";
import Card from "react-bootstrap/Card";


const CommercialCard = (props) => {

	return (
		<Fragment>
			<Card style={ {backgroundColor: "hsl(220, 30%, 75%)"} }>
				<Card.Body>
					<Card.Title
						style={ props.titleStyle }>
						{ props.title }
					</Card.Title>
					<hr/>
					<Card.Text
						as={ "div" }
						style={ {fontSize: "12px"} }>
						<div className="wpm-row">
							<p>{ props.textLabelTop }</p>
							<p>{ props.textValueTop }</p>
						</div>
						<div className="wpm-row">
							<p style={ {textAlign: "left", fontWeight: "bold"} }>{ props.textLabelMid }</p>
							<p style={ {textAlign: "right", fontWeight: "bold"} }>{ props.textValueMid }</p>
						</div>
						<div className="wpm-row">
							<p>{ props.textLabelBtm }</p>
							<p>{ props.textValueBtm }</p>
						</div>
						<div className="wpm-row">
							<p style={ props.textValueMisc === "NOT SUBMITTED" ? {fontWeight: 'bold'} : {} }>{ props.textLabelMisc }</p>
							<p
								style={ props.textValueMisc === "NOT SUBMITTED" ? {fontWeight: 'bold'} : {} }>{ props.textValueMisc }</p>
						</div>
					</Card.Text>
				</Card.Body>
				<Card.Footer style={ {backgroundColor: "hsl(180, 20%, 90%)", fontSize: "14px"} }>
					{ props.footer }
				</Card.Footer>
			</Card>
		</Fragment>
	);
};
export default CommercialCard;
