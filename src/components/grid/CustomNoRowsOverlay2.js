import React, { Component } from "react";

export default class CustomNoRowsOverlay extends Component {
	render() {
		return (
			<h6> { this.props.noRowsMessageFunc() }</h6>

		);
	}
}
