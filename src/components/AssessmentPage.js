import React from 'react';
import { useState } from 'react';
import CameraView from './CameraView';
import '../styles/AssessmentPage.css';

export default function AssessmentPage(props) {
    // State for assessment 
    const [assessment, setAssessment] = useState(false);

    function startAssessment() {
        setAssessment(true);
    }

    return (
        <div className="assessment-container">
            <div className="assessment-info">
                <h1 className="assessment-title">Assessment {props.assessmentNum}</h1>
                <p className="assessment-description">{props.assessmentDescription}</p>
            </div>
            {/*<div className="assessment-body">*/}
                {assessment?<CameraView />:<button className="ready-button" onClick={startAssessment}>Ready</button>}
            {/*</div>*/}
            <div className="assessment-footer">
                <button className="assessment-button">Home</button>
                <button className="assessment-button">Next</button>
            </div>
        </div>
    );
}