import React from 'react';
import './HandTracker.css';
import Webcam from 'react-webcam';
import {Hands} from '@mediapipe/hands'; 
import * as hands from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import {useRef, useEffect, useState} from 'react';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const startTime = Date.now();
const LandMarkData = [];

function HandTracker(){
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
  
const objectToCSVRow = (dataObject) => {
  let dataArray = [];
  for (let o in dataObject) {
      let innerValue = dataObject[o]===null? '' : dataObject[o].toString();
      let result = innerValue.replace(/"/g, ' ');
      result = ' ' + result + ', ';
      dataArray.push(result);
  }
  return dataArray.join(' ') + '\r\n';
}

  const downloadCSV = (arrayOfObjects=[]) =>{
    if (!arrayOfObjects.length) {
      return alert('No data available for download.');
  }
  let csvContent = "data:text/csv;charset=utf-8,";
  arrayOfObjects.forEach((item)=>{
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

  const collectData = (objArr) =>{
    const coordinates=[];
    //Determines the time stamp of each dataset 
    const endTime = Date.now();
    const deltaTime = endTime - startTime;
    coordinates.push(deltaTime);
    //console.log(objArr);
    //Iterate through the array of landmarks which contain 21 distinct sets of points
    
    for(let i=0; i<21; i++){
      //Retrieve the x, y, z points of each landmark 
      const xVal = objArr.multiHandLandmarks[0][i].x;
      const yVal = objArr.multiHandLandmarks[0][i].y;
      const zVal = objArr.multiHandLandmarks[0][i].z;
      //Push the points to an array reducing to 6 decimal points 
      coordinates.push([parseFloat(xVal), parseFloat(yVal), parseFloat(zVal)]);
    }

    LandMarkData.push(coordinates);
    
    const vectors = convertToVector(coordinates);
    const magnitudes =  calculateMagnitude(vectors);
    const angles = calculateAngle(vectors, magnitudes, deltaTime);
    
    console.log("Coordinates",coordinates);
    console.log("Vectors\n", vectors);
    console.log("Magnitudes", magnitudes);   
    console.log("Angles", angles);
    console.log("\n\n");
  }

  //Checks out 
  const convertToVector = (coordinates) =>{
    //Landmark 0 --> Landmark 4
    const vectors1 = [];
    //Landmark 0 --> Landmark 8
    const vectors2 = [];
    //Landmark 0 --> Landmark 12
    const vectors3 = [];
    //Landmark 0 --> Landmark 16
    const vectors4 = [];
    //Landmark 0 --> Landmark 20
    const vectors5 = [];
    //Each set of vectors 
    const allVectors = [];
    //camRes1 => x,z camRes2 => y 
    //Split hand coordinates into 5 arrays (sections)
    //Section 1 - has 4 vectors 
    for(let i = 1; i<5; i++){
      const x1 = coordinates[i][0] * camRes1;
      const y1 = coordinates[i][1] * camRes2;
      const z1 = coordinates[i][2] * camRes1;
      const x2 = coordinates[i+1][0] * camRes1;
      const y2 = coordinates[i+1][1]* camRes2;
      const z2 = coordinates[i+1][2]* camRes1;
      let vx = (x2 - x1);
      let vy = (y2 - y1);
      let vz = (z2 - z1);
      vx=parseFloat(vx)
      vy=parseFloat(vy)
      vz=parseFloat(vz)
      vectors1.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
    }

    //Section 2
    for(let j = 1; j<5; j++){
      //initially add 4 after first increment 
      if(j==1){
        let vx = ((coordinates[j+5][0]* camRes1)-(coordinates[j][0]* camRes1));
        let vy = ((coordinates[j+5][1]* camRes2)-(coordinates[j][1]* camRes2));
        let vz = ((coordinates[j+5][2]* camRes1)-(coordinates[j][2]* camRes1));
        vx=parseFloat(vx)
        vy=parseFloat(vy)
        vz=parseFloat(vz)
        vectors2.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
      }
      else{
        const x1 = coordinates[j+4][0]* camRes1;
        const y1 = coordinates[j+4][1]* camRes2;
        const z1 = coordinates[j+4][2]* camRes1;
        const x2 = coordinates[j+5][0]* camRes1;
        const y2 = coordinates[j+5][1]* camRes2;
        const z2 = coordinates[j+5][2]* camRes1;
        let vx = (x2 - x1);
        let vy = (y2 - y1);
        let vz = (z2 - z1);
        vx=parseFloat(vx)
        vy=parseFloat(vy)
        vz=parseFloat(vz)
        vectors2.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
      }
    }

    //Section 3
    for(let k = 1; k<5; k++){
      //initially add 4 after first increment 
      if(k==1){
        let vx = ((coordinates[k+9][0]* camRes1)-(coordinates[k][0]* camRes1));
        let vy = ((coordinates[k+9][1]* camRes2)-(coordinates[k][1]* camRes2));
        let vz = ((coordinates[k+9][2]* camRes1)-(coordinates[k][2]* camRes1));
        vx=parseFloat(vx)
        vy=parseFloat(vy)
        vz=parseFloat(vz)
        vectors3.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
      }
      else{
        const x1 = coordinates[k+8][0]* camRes1;
        const y1 = coordinates[k+8][1]* camRes2;
        const z1 = coordinates[k+8][2]* camRes1;
        const x2 = coordinates[k+9][0]* camRes1;
        const y2 = coordinates[k+9][1]* camRes2;
        const z2 = coordinates[k+9][2]* camRes1;
        //1. 10, 1  2. 11, 10 3. 12, 11 4. 13, 12
        let vx = (x2 - x1);
        let vy = (y2 - y1);
        let vz = (z2 - z1);
        vx=parseFloat(vx)
        vy=parseFloat(vy)
        vz=parseFloat(vz)
        vectors3.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
      }
    }

    //Section 4
    for(let u = 1; u<5; u++){
      //initially add 4 after first increment 
      if(u==1){
        let vx = ((coordinates[u+13][0]* camRes1)-(coordinates[u][0]* camRes1));
        let vy = ((coordinates[u+13][1]* camRes2)-(coordinates[u][1]* camRes2));
        let vz = ((coordinates[u+13][2]* camRes1)-(coordinates[u][2]* camRes1));
        vx=parseFloat(vx)
        vy=parseFloat(vy)
        vz=parseFloat(vz)
        vectors4.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
      }
      else{
        const x1 = coordinates[u+12][0]* camRes1;
        const y1 = coordinates[u+12][1]* camRes2;
        const z1 = coordinates[u+12][2]* camRes1;
        const x2 = coordinates[u+13][0]* camRes1;
        const y2 = coordinates[u+13][1]* camRes2;
        const z2 = coordinates[u+13][2]* camRes1;
        //1.  14, 1   2. 15, 14   3. 16, 15   4. 17, 16
        let vx = (x2 - x1);
        let vy = (y2 - y1);
        let vz = (z2 - z1);
        
        vectors4.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
      }
    }

    //Section 5
    for(let v = 1; v<5; v++){
      //initially add 4 after first increment 
      if(v==1){
        let vx = ((coordinates[v+17][0]* camRes1)-(coordinates[v][0]* camRes1));
        let vy = ((coordinates[v+17][1]* camRes2)-(coordinates[v][1]* camRes2));
        let vz = ((coordinates[v+17][2]* camRes1)-(coordinates[v][2]* camRes1));
        
        vectors5.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
      }
      else{
        const x1 = coordinates[v+16][0]* camRes1;
        const y1 = coordinates[v+16][1]* camRes2;
        const z1 = coordinates[v+16][2]* camRes1;
        const x2 = coordinates[v+17][0]* camRes1;
        const y2 = coordinates[v+17][1]* camRes2;
        const z2 = coordinates[v+17][2]* camRes1;
        //1. 18, 1   2. 19, 18  3. 20, 19 4. 21, 20
        let vx = (x2 - x1);
        let vy = (y2 - y1);
        let vz = (z2 - z1);
        
        vectors5.push([parseFloat(vx), parseFloat(vy), parseFloat(vz)]);
      }
    }

    allVectors.push(vectors1, vectors2, vectors3, vectors4, vectors5)
    return allVectors;
  }

  //Checks out 
  const calculateMagnitude = (vectors) =>{
    const magnitudes = [];
    for(let i = 0; i<vectors.length; i++){
      const magnitudeSet = [];
      for(let j = 0; j<vectors.length-1; j++){
        let x = vectors[i][j][0];
        let y = vectors[i][j][1];
        let z = vectors[i][j][2];
        let absVal = abs(x,y,z);
        parseFloat(absVal);
        magnitudeSet.push(absVal);
      }
      magnitudes.push(magnitudeSet);
    }
    return magnitudes;
  }

  //Check 
  const calculateAngle = (vectors, magnitudes, time) => {
    const angles = [time];
    
  //theta = arccos((v1 dot v2)/(|v1||v2|))
  for(let set = 0; set<5; set++){
    angles.push(angle(vectors[set][0], vectors[set][1], magnitudes[set][0], magnitudes[set][1]));
    angles.push(angle(vectors[set][1], vectors[set][2], magnitudes[set][1], magnitudes[set][2]));
    angles.push(angle(vectors[set][2], vectors[set][3], magnitudes[set][2], magnitudes[set][3]));
  }

  /*
  //Vector 
   let ThumbCMC	= angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let ThumbMCP	= angle(vectors[0][1], vectors[0][2], magnitudes[1], magnitudes[2]);
   let ThumbIP = angle(vectors[0][2], vectors[0][3], magnitudes[0], magnitudes[1]);
   let IndexMCP	= angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let IndexPIP	= angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let IndexDIP	= angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let LongMCP = angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let LongPIP = angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let LongDIP = angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let RingMCP = angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let RingPIP = angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let RingDIP = angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let SmallMCP	= angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let SmallPIP = angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   let SmallDIP = angle(vectors[0][0], vectors[0][1], magnitudes[0], magnitudes[1]);
   */
  return angles;
  }

  const angle = (vectorOne, vectorTwo, magnitudeOne, magnitudeTwo) => {
    let dotProductResult = dotProduct(vectorOne, vectorTwo);
    let innerCalculation = dotProductResult/(magnitudeOne*magnitudeTwo);
    let angleResult = Math.acos(innerCalculation);
    angleResult = parseFloat(angleResult) * (180/Math.PI);
    angleResult = angleResult.toFixed(2);
    return angleResult;
  }

  const dotProduct = (v1, v2) =>{
    let result = (v1[0]*v2[0])+(v1[1]*v2[1])+(v1[2]*v2[2]);
    return result; 
  }

  const abs = (x,y,z) =>{
    const squareSum = Math.pow(x,2) + Math.pow(y,2) + Math.pow(z,2);
    const absolute = Math.sqrt(squareSum); 
    return absolute;
  }

  const countData = (array) =>{
    const size = array.length;
    return size;
  };


  const onResults = (results)=>{
    const videoWidth = webCamRef.current.video.videoWidth;
    const videoHeight = webCamRef.current.video.videoHeight;

    //Sets height and width of canvas 
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasElement =  canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    canvasCtx.save();
    canvasCtx.clearRect(0,0,canvasElement.width,canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    if(results.multiHandLandmarks){
      
      for(const landmarks of results.multiHandLandmarks) {
        drawConnectors(canvasCtx, landmarks, hands.HAND_CONNECTIONS,
          {color: "#00FF00", lineWidth: 2});
        drawLandmarks(canvasCtx, landmarks, {color: "#00ffd0", lineWidth: 1});//#5d0db8 purple
      
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
  
  useEffect(()=>{
    const hands = new Hands({
      locateFile:(file)=>{
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1626903359/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.75,
      minTrackingConfidence: 0.7
    });

    hands.onResults(onResults);

    if(typeof webCamRef.current !== 'undefined' && webCamRef.current !== null){
      camera = new cam.Camera(webCamRef.current.video,{
      onFrame: async()=>{
        await hands.send({image:webCamRef.current.video})
      }
      });
      camera.start();
      
    }
  }, []);

  function eventHandler(){
    downloadCSV(LandMarkData);
  }

  function onChangeInput1(e){
    setInput1(e.target.value);
  }

  function onChangeInput2(e){
    setInput2(e.target.value);
  }

  function setResolution(e){
    e.preventDefault();
    setCamRes1(parseInt(input1));
    setInput1("");
    setCamRes2(parseInt(input2));
    setInput2("");
    console.log(input1, input2);
  }


  return(
    <div className="container-hand-tracker">
    <div className="main-container">
    <h1>Please Use One Hand</h1>
    <Webcam ref={webCamRef} />

    <canvas 
      ref={canvasRef}
      className="output-canvas"
      /> 
    </div>

    <div className="container-data">
      <div>
        <h2>Landmark_0</h2>
        <p>X: {digit_x}</p>
        <p>Y: {digit_y}</p>
        <p>Z: {digit_z}</p>
        <p>Number of datasets recorded: {countData(LandMarkData)}</p>
      </div>

      <form className="utility-container">
        <label className="selection-label">Enter your camera resolution</label>
        <input className="input-box" type="text" value={input1} onChange={(e)=>onChangeInput1(e)} placeholder="Default set is 720p" />
        <input className="input-box" type="text" value={input2} onChange={(e)=>onChangeInput2(e)} placeholder="Default set is 1280p" />
        <button className="button-csv" onClick={setResolution}>Set new resolution</button>
        <button className="button-csv" onClick={eventHandler}>Download CSV</button>
      </form>
    </div>
    </div>
  )
}

export default HandTracker;