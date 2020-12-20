import Button from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";

export const GreyButton = styled(Button)({
  backgroundImage: "linear-gradient(hsl(0, 0%, 80%), hsl(0, 0%, 25%))",
  borderColor: "white",
  color: "white",
  padding: "5px 20px",
  justifyContent: "space-around",
  textTransform: "uppercase",
  fontSize: "15px",
  margin: "2px 2px",
  textDecoration: "none",
  "&:hover": {
    backgroundImage: "linear-gradient(hsl(0, 0%, 25%), hsl(10, 0%, 80%))",
    borderColor: "black",
  },
});

export const GreenButton = styled(Button)({
	backgroundImage: "linear-gradient(hsl(180, 50%, 25%), hsl(180, 50%, 15%))",
	borderColor: "white",
	color: "white",
	padding: "5px 10px",
	justifyContent: "space-around",
	// textAlign: "center",
	textTransform: "uppercase",
	fontSize: "15px",
	margin: "3px 2px",
	textDecoration: "none",
	"&:hover": {
		backgroundImage: "linear-gradient(hsl(180, 50%, 15%), hsl(180, 50%, 30%))",
		borderColor: "black",
	},
});

export const RedButton = styled(Button)({
  backgroundImage: "linear-gradient(hsl(351, 50%, 50%), #730d1c)",
  borderColor: "white",
  color: "white",
  padding: "5px 10px",
  justifyContent: "space-around",
  // textAlign: "center",
  textTransform: "uppercase",
  fontSize: "15px",
  margin: "3px 2px",
  textDecoration: "none",
  "&:hover": {
    backgroundImage: "linear-gradient(hsl(351, 50%, 25%), hsl(351, 80%, 50%))",
    borderColor: "black",
  },
});

export const BlueButton = styled(Button)({
  backgroundImage: "linear-gradient(hsl(235, 50%, 50%), hsl(235, 94%, 25%))",
  borderColor: "white",
  color: "white",
  padding: "5px 10px",
  justifyContent: "space-around",
  // textAlign: "center",
  textTransform: "uppercase",
  fontSize: "15px",
  margin: "3px 2px",
  textDecoration: "none",
  "&:hover": {
    backgroundImage: "linear-gradient(hsl(235, 80%, 25%), hsl(235, 50%, 50%))",
    borderColor: "black",
  },
});

export const PurpleButton = styled(Button)({
  backgroundImage: "linear-gradient(hsl(300, 100%, 30%), hsl(300, 79%, 11%))",
  borderColor: "white",
  color: "white",
  padding: "5px 10px",
  justifyContent: "space-around",
  // textAlign: "center",
  textTransform: "uppercase",
  fontSize: "15px",
  margin: "3px 2px",
  textDecoration: "none",
  "&:hover": {
    backgroundImage: "linear-gradient(hsl(300, 80%, 15%), hsl(300, 100%, 30%))",
    borderColor: "black",
  },
});
