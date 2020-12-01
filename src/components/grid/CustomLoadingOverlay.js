import React from "react";
import Loader from "react-loader-spinner";

export default (props) => {
	return (
		<Loader
			style={ {textAlign: "center"} }
			type={ "ThreeDots" }
			color="#366363"
		/>
	);
};
