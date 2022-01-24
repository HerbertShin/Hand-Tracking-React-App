import React from 'react';
import '../styles/CameraView.css';
import * as Automation from '../utilities/automation';
import Webcam from 'react-webcam';
import { Hands } from '@mediapipe/hands';
import * as hands from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import { useRef, useEffect, useState } from 'react';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

function CameraView() {
  const webCamRef = useRef(null);
  const canvasRef = useRef(null);
  const [digit_x, setDigit_x] = useState(0);
  const [digit_y, setDigit_y] = useState(0);
  const [digit_z, setDigit_z] = useState(0);
  const [camRes1, setCamRes1] = useState(720);
  const [camRes2, setCamRes2] = useState(1280);
  const [input1, setInput1] = useState(720);
  const [input2, setInput2] = useState(1280);
  let camera = null;
  const LandMarkData = [];
  let startTime = 0;

  useEffect(() => {
    // Get user device camera resolution 
    // Constraints for the getUserMedia API 

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1626903359/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.75,
      minTrackingConfidence: 0.7
    });

    hands.onResults(onResults);

    if (typeof webCamRef.current !== 'undefined' && webCamRef.current !== null) {
      camera = new cam.Camera(webCamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webCamRef.current.video })
        }
      });
      camera.start();
      startTime = Date.now();
    }
  }, []);

  const objectToCSVRow = (dataObject) => {
    let dataArray = [];
    for (let o in dataObject) {
      let innerValue = dataObject[o] === null ? '' : dataObject[o].toString();
      let result = innerValue.replace(/"/g, ' ');
      result = ' ' + result + ', ';
      dataArray.push(result);
    }
    return dataArray.join(' ') + '\r\n';
  }

  const downloadCSV = (arrayOfObjects = []) => {
    if (!arrayOfObjects.length) {
      return alert('No data available for download.');
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    arrayOfObjects.forEach((item) => {
      csvContent += objectToCSVRow(item);
    });
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "landmarkData.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Collect data 
  const collectData = (objArr) => {
    // Coordinates
    const coordinates = [];
    // Start time 
    const endTime = Date.now();
    // Time differene for time stamps 
    const deltaTime = endTime - startTime;
    // Insert time stamp as first entry 
    coordinates.push(deltaTime);

    //Iterate through the array of landmarks which contain 21 distinct sets of points
    for (let i = 0; i < 21; i++) {
      //Retrieve the x, y, z points of each landmark 
      const xVal = objArr.multiHandLandmarks[0][i].x;
      const yVal = objArr.multiHandLandmarks[0][i].y;
      const zVal = objArr.multiHandLandmarks[0][i].z;
      //Push the points to an array reducing to 6 decimal points 
      coordinates.push([parseFloat(xVal), parseFloat(yVal), parseFloat(zVal)]);
    }

    LandMarkData.push(coordinates);
    const vectors = Automation.convertToVector(coordinates, camRes1, camRes2);
    const magnitudes = Automation.calculateMagnitude(vectors);
    const angles = Automation.calculateAngle(vectors, magnitudes, deltaTime);

    console.log("Coordinates", coordinates);
    console.log("Vectors\n", vectors);
    console.log("Magnitudes", magnitudes);
    console.log("Angles", angles);
    console.log("\n\n");
  }

  const onResults = (results) => {
    const videoWidth = webCamRef.current.video.videoWidth;
    const videoHeight = webCamRef.current.video.videoHeight;

    //Sets height and width of canvas 
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if (results.multiHandLandmarks) {

      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, hands.HAND_CONNECTIONS,
          { color: "#00FF00", lineWidth: 2 });
        drawLandmarks(canvasCtx, landmarks, { color: "#00ffd0", lineWidth: 1 });//#5d0db8 purple

      }
      const x = results.multiHandLandmarks[0][0].x;
      const y = results.multiHandLandmarks[0][0].y;
      const z = results.multiHandLandmarks[0][0].z;

      setDigit_x(x);
      setDigit_y(y);
      setDigit_z(z);

      collectData(results);
    }
    canvasCtx.restore();
  }



  function eventHandler() {
    downloadCSV(LandMarkData);
  }

  function onChangeInput1(e) {
    setInput1(e.target.value);
  }

  function onChangeInput2(e) {
    setInput2(e.target.value);
  }

  function setResolution(e) {
    e.preventDefault();
    setCamRes1(parseInt(input1));
    setInput1("");
    setCamRes2(parseInt(input2));
    setInput2("");
    console.log(input1, input2);
  }


  return (
    <div className="container-hand-tracker">
      <div className="main-container">
        <Webcam className="webcam" ref={webCamRef} />
        
        <canvas
          ref={canvasRef}
          className="output-canvas"
        />
      </div>
    </div>
  )
}

export default CameraView;