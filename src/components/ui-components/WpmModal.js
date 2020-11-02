import React, {useContext, useRef} from "react";
import {Col, Modal} from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { connectModal } from 'redux-modal'
import {GreenButton, RedButton} from "./Buttons";

const WpmModal = props => {
    const { show, handleHide, content, title } = props
    return (
      <Modal show={show} style={{width: "100%"}}>
        <Modal.Header>
          <Modal.Title>Hello</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          { content }
        </Modal.Body>

        <Modal.Footer>
          <GreenButton onClick={handleHide}>Close</GreenButton>
          <RedButton  onClick={handleHide}>Save changes</RedButton>
        </Modal.Footer>
      </Modal>
    );
}
export default connectModal({ name: 'wpm-modal' })(WpmModal)
