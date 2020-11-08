import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useRef } from "react";
import { Col, Modal } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
	paper: {

		display: "flex",
		flexDirection: "column",
		alignItems: "left",
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},

	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const WpmModal = (props) => {
	const dispatch = useDispatch();
	const showModal = useSelector(state => state.components.showModal);
	const modalTitle = useSelector(state => state.components.modalTitle);
	const modalContent = useSelector(state => state.components.modalContent);
	const submitButtonRef = useRef();
	const classes = useStyles();
	const {show, handleHide, message, content, title, hideModal} = props;
	return (
		<div>
			<Modal show={ show } onHide={ hideModal } backdrop={ true } size='lg' autoFocus={ false } centered={ false }
			       scrollable={ true }>
				<Modal.Header closeButton style={ {backgroundColor: "hsl(180, 30%, 30%)", color: "white"} }>
					<Modal.Title style={ {textAlign: "center"} }>{ title }</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{ content }
				</Modal.Body>
				<Modal.Footer style={ {justifyContent: "space-between"} }>
					<Col>
						<Button
							fullWidth
							variant="contained"
							color="primary"
							className={ classes.submit }

						>SAVE</Button>
					</Col>
					<Col>
						<Button

							fullWidth
							variant="contained"
							color="secondary"

							onClick={ hideModal }>CLOSE
						</Button>

					</Col>
				</Modal.Footer>
			</Modal>
		</div>
	);
};
export default WpmModal;
