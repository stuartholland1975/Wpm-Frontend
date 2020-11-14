import React from 'react';
import LetterW from "../icons/letter-w.png";
import LetterP from "../icons/letter-p.png";
import LetterM from "../icons/letter-m.png";


export default function WpmLogo() {
    return (
        <div style={{margin: 'auto'}}>
            <img src={LetterW} alt="W" height="400px"/>
            <img src={LetterP} alt="P" height="400px"/>
            <img src={LetterM} alt="M" height="400px"/>
            <hr/>
        </div>

    )
}