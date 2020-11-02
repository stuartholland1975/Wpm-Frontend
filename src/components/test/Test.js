import React from "react";
import {useDispatch} from "react-redux";
import {BlueButton} from "../ui-components/Buttons";
import {show} from 'redux-modal'
import InstructionForm from "../work-instructions/InstructionForm";

const Test = (props) => {
    const dispatch = useDispatch()

    const handleOpen = name => () => {
        dispatch(show(name, {content: <InstructionForm/>, title: "CREATE WORK INSTRUCTION"}))
    };
    return <div>

        <BlueButton onClick={handleOpen('wpm-modal')}>CREATE</BlueButton>

    </div>
};
export default Test;
