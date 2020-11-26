import React, { Fragment } from "react";
import { Card, CardDeck, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffectOnce } from "react-use";
import { selectAllAreas } from "../../services/data/areaData";
import { fetchAreas } from "../../services/thunks";

const numFormat = (num) => {
	return num.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const formatNumber = (value) =>
	Math.floor(value)
		.toString()
		.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");


function Workload(props) {

	const dispatch = useDispatch();
	const orderValues = useSelector(selectAllAreas).sort(function (a, b) {
		return a["id"] - b["id"];
	});

	useEffectOnce(() => {
		dispatch(fetchAreas());
		//dispatch(fetchWorkInstructions());
	});

	return (
		<Container fluid>

			<h3 style={{textAlign: "center"}}>CONTRACT WORKLOAD</h3>
			<hr/>
			<CardDeck>

				<Card style={ {backgroundColor: "hsl(180, 20%, 75%)"} }>
					<Card.Body>
						<Card.Title
							style={ {fontWeight: "bold", textAlign: "center"} }>All Areas
						</Card.Title>
						<hr/>
						<Card.Text>
							<Row>
								<Col>
									<p>Order Book:</p>
								</Col>
								<Col>
									<p style={ {
										textAlign: "right",
										fontWeight: "bold"
									} }>{ formatNumber(orderValues.map(item => item.order_value).reduce((acc, item) => acc + item, 0)) }</p>
								</Col>
							</Row>
							<Row>
								<Col>
									<p>Work Complete:</p>
								</Col>
								<Col>
									<p style={ {
										textAlign: "right",
										fontWeight: "bold"
									} }>{ formatNumber(orderValues.map(item => item["complete_value"]).reduce((acc, item) => acc + item, 0)) }</p>
								</Col>
							</Row>
							<Row>
								<Col>
									<p>Work To Do:</p>
								</Col>
								<Col>
									<p style={ {
										textAlign: "right",
										fontWeight: "bold"
									} }>{ formatNumber(orderValues.map(item => item.order_value - item["complete_value"]).reduce((acc, item) => acc + item, 0)) }</p>
								</Col>
							</Row>
							<Row>
								<Col>
									<p>Applied Value:</p>
								</Col>
								<Col>
									<p style={ {
										textAlign: "right",
										fontWeight: "bold"
									} }>{ formatNumber(orderValues.map(item => item["applied_value"]).reduce((acc, item) => acc + item, 0)) }</p>
								</Col>
							</Row>
						</Card.Text>
					</Card.Body>

				</Card>
				{ orderValues.map(item => {
					const {order_value, applied_value, complete_value, area_description} = item;
					return (
						<Card style={ {backgroundColor: "hsl(180, 20%, 75%)"} }>
							<Card.Body>
								<Card.Title
									style={ {
										fontWeight: "bold",
										textAlign: "center",
										paddingLeft: "20px",
										paddingRight: "20px"
									} }>{ area_description }
								</Card.Title>
								<hr/>
								<Card.Text>
									<Row>
										<Col>
											<p>Order Book:</p>
										</Col>
										<Col>
											<p style={ {textAlign: "right"} }>{ formatNumber(order_value) }</p>
										</Col>
									</Row>
									<Row>
										<Col>
											<p>Work Complete:</p>
										</Col>
										<Col>
											<p style={ {textAlign: "right"} }>{ formatNumber(complete_value) }</p>
										</Col>
									</Row>
									<Row>
										<Col>
											<p>Work To Do:</p>
										</Col>
										<Col>
											<p style={ {textAlign: "right"} }>{ formatNumber(order_value - complete_value) }</p>
										</Col>
									</Row>
									<Row>
										<Col>
											<p>Applied Value:</p>
										</Col>
										<Col>
											<p style={ {textAlign: "right"} }>{ formatNumber(applied_value) }</p>
										</Col>
									</Row>
								</Card.Text>
							</Card.Body>
						</Card>
					);
				}) }
			</CardDeck>
			<hr/>
		</Container>
	);
}

export default Workload;