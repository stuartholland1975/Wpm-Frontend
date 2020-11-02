import React, {useRef} from "react";
import InstructionForm from "./InstructionForm";
import {Col, Modal} from "react-bootstrap";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {connectModal} from 'redux-modal'


const useStyles = makeStyles((theme) => ({
    paper: {

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },

    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const WorkInstructionForm = (props) => {

    const classes = useStyles()
    const {show, handleHide, message} = props
    const formRef = useRef()


    return (
        <div>
            <Modal show={show} onHide={handleHide} backdrop={true} size='lg' autoFocus={false} centered={false}
                   scrollable={true}>
                <Modal.Header closeButton style={{backgroundColor: "hsl(180, 30%, 30%)", color: "white"}}>
                    <Modal.Title style={{textAlign: 'center'}}>{message}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InstructionForm/>
                </Modal.Body>
                <Modal.Footer style={{justifyContent: "space-between"}}>
                    <Col>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            ref={formRef}

                        >SAVE</Button>
                    </Col>
                    <Col>
                        <Button

                            fullWidth
                            variant="contained"
                            color="secondary"

                            onClick={handleHide}>CLOSE
                        </Button>

                    </Col>
                </Modal.Footer>
            </Modal>
        </div>
    )
};
export default connectModal({name: 'work-instruction-form'})(WorkInstructionForm)
