import React from "react";
import Container from "react-bootstrap/Container";
import WpmLogo from "../ui-components/WpmLogo";

const Home = props => {
	return <Container fluid>
		<div style={ {textAlign: "center"} }><WpmLogo/></div>
		<h1 style={ {textAlign: "center", fontWeight: "bolder"} }>WORK PACKAGE MANAGER</h1></Container>;
};

export default Home;
