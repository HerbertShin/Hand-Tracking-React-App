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
  const [camRes, setCamRes] = useState(720);
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
      coordinates.push([parseFloat(xVal.toFixed(6)), parseFloat(yVal.toFixed(6)), parseFloat(zVal.toFixed(6))]);
    }
    
    //Push the set of data into a static array 
    //console.log(coordinates);
    

    const v = convertToVector(coordinates);
    const m =  calculateMagnitude(v);
    const a = calculateAngle(v, m, deltaTime);
    console.log(v);
    console.log(m);   
    console.log(a);
  }

  const convertToVector = (coordinates) =>{
    const vectors1 = [];
    const vectors2 = [];
    const vectors3 = [];
    const vectors4 = [];
    const vectors5 = [];
    const allVectors = [];
    //coord[array][indice in array] 
    //Split hand coordinates into 5 arrays (sections)
    //Section 1 - has 4 vectors 
    for(let i = 1; i<5; i++){
      const x1 = coordinates[i][0];
      const y1 = coordinates[i][1];
      const z1 = coordinates[i][2];
      const x2 = coordinates[i+1][0];
      const y2 = coordinates[i+1][1];
      const z2 = coordinates[i+1][2];
      const vx = (x2 - x1)*camRes;
      const vy = (y2 - y1)*camRes;
      const vz = (z2 - z1)*camRes;
      parseFloat(vx).toFixed(6);
      parseFloat(vy).toFixed(6);
      parseFloat(vz).toFixed(6);
      vectors1.push([vx, vy, vz]);
    }
    //Section 2
    for(let j = 1; j<5; j++){
      //initially add 4 after first increment 
      if(j==1){
        const vx = (coordinates[j+5][0]-coordinates[j][0])*camRes;
        const vy = (coordinates[j+5][1]-coordinates[j][1])*camRes;
        const vz = (coordinates[j+5][2]-coordinates[j][2])*camRes;
        parseFloat(vx).toFixed(6);
        parseFloat(vy).toFixed(6);
        parseFloat(vz).toFixed(6);
        vectors2.push([vx, vy,vz]);
      }
      else{
        const x1 = coordinates[j+4][0];
        const y1 = coordinates[j+4][1];
        const z1 = coordinates[j+4][2];
        const x2 = coordinates[j+5][0];
        const y2 = coordinates[j+5][1];
        const z2 = coordinates[j+5][2];
        const vx = (x2 - x1)*camRes;
        const vy = (y2 - y1)*camRes;
        const vz = (z2 - z1)*camRes;
        parseFloat(vx).toFixed(6);
        parseFloat(vy).toFixed(6);
        parseFloat(vz).toFixed(6);
        vectors2.push([vx, vy, vz]);
      }
    }
    //Section 3
    for(let k = 1; k<5; k++){
      //initially add 4 after first increment 
      if(k==1){
        const vx = (coordinates[k+9][0]-coordinates[k][0])*camRes;
        const vy = (coordinates[k+9][1]-coordinates[k][1])*camRes;
        const vz = (coordinates[k+9][2]-coordinates[k][2])*camRes;
        parseFloat(vx).toFixed(6);
        parseFloat(vy).toFixed(6);
        parseFloat(vz).toFixed(6);
        vectors3.push([vx, vy,vz]);
      }
      else{
        const x1 = coordinates[k+8][0];
        const y1 = coordinates[k+8][1];
        const z1 = coordinates[k+8][2];
        const x2 = coordinates[k+9][0];
        const y2 = coordinates[k+9][1];
        const z2 = coordinates[k+9][2];
        //1. 10, 1  2. 11, 10 3. 12, 11 4. 13, 12
        const vx = (x2 - x1)*camRes;
        const vy = (y2 - y1)*camRes;
        const vz = (z2 - z1)*camRes;
        parseFloat(vx).toFixed(6);
        parseFloat(vy).toFixed(6);
        parseFloat(vz).toFixed(6);
        vectors3.push([vx, vy, vz]);
      }
    }
    //Section 4
    for(let u = 1; u<5; u++){
      //initially add 4 after first increment 
      if(u==1){
        const vx = (coordinates[u+13][0]-coordinates[u][0])*camRes;
        const vy = (coordinates[u+13][1]-coordinates[u][1])*camRes;
        const vz = (coordinates[u+13][2]-coordinates[u][2])*camRes;
        parseFloat(vx).toFixed(6);
        parseFloat(vy).toFixed(6);
        parseFloat(vz).toFixed(6);
        vectors4.push([vx, vy,vz]);
      }
      else{
        const x1 = coordinates[u+12][0];
        const y1 = coordinates[u+12][1];
        const z1 = coordinates[u+12][2];
        const x2 = coordinates[u+13][0];
        const y2 = coordinates[u+13][1];
        const z2 = coordinates[u+13][2];
        //1.  14, 1   2. 15, 14   3. 16, 15   4. 17, 16
        const vx = (x2 - x1) * camRes;
        const vy = (y2 - y1) * camRes;
        const vz = (z2 - z1) * camRes;
        parseFloat(vx).toFixed(6);
        parseFloat(vy).toFixed(6);
        parseFloat(vz).toFixed(6);
        vectors4.push([vx, vy, vz]);
      }
    }
    //Section 5
    for(let v = 1; v<5; v++){
      //initially add 4 after first increment 
      if(v==1){
        const vx = (coordinates[v+17][0]-coordinates[v][0])*camRes;
        const vy = (coordinates[v+17][1]-coordinates[v][1])*camRes;
        const vz = (coordinates[v+17][2]-coordinates[v][2])*camRes;
        parseFloat(vx).toFixed(6);
        parseFloat(vy).toFixed(6);
        parseFloat(vz).toFixed(6);
        vectors5.push([vx, vy,vz]);
      }
      else{
        const x1 = coordinates[v+16][0];
        const y1 = coordinates[v+16][1];
        const z1 = coordinates[v+16][2];
        const x2 = coordinates[v+17][0];
        const y2 = coordinates[v+17][1];
        const z2 = coordinates[v+17][2];
        //1. 18, 1   2. 19, 18  3. 20, 19 4. 21, 20
        const vx = (x2 - x1) * camRes;
        const vy = (y2 - y1) * camRes;
        const vz = (z2 - z1) * camRes;
        parseFloat(vx).toFixed(6);
        parseFloat(vy).toFixed(6);
        parseFloat(vz).toFixed(6);
        vectors5.push([vx, vy, vz]);
      }
    }

    allVectors.push(vectors1, vectors2, vectors3, vectors4, vectors5)
    return allVectors;
  }

  const calculateMagnitude = (vectors) =>{
    const magnitudes = [];
    for(let i = 0; i<vectors.length; i++){
      for(let j = 0; j<vectors.length-1; j++){
        let x = vectors[i][j][0];
        let y = vectors[i][j][1];
        let z = vectors[i][j][2];
        let absVal = Math.abs(x,y,z);
        parseFloat(absVal).toFixed(6);
        magnitudes.push(absVal);
      }
    }
    return magnitudes;
  }

  const calculateAngle = (vectors, magnitudes, time) => {
    const angles = [time];
    
    //theta = arccos((v1 dot v2)/(|v1||v2|))
    
    //Vector 
    //Double check bounds 
    //Double check correct order 
    //Double check correct values are being referenced 
    for(let i = 0; i<vectors.length; i++){
      for(let j = 0; j<3; j++){
        let v1 = vectors[i][j];
        let v2 = vectors[i][j+1];
        let theta = dotProduct(v1,v2)/(magnitudes[i]*magnitudes[i+1]);
        angles.push(theta);
      }
    }


   //ThumbCMC	
   //ThumbMCP	
   //ThumbIP
   //IndexMCP	
   //IndexPIP	
   //IndexDIP	
   //LongMCP
   //LongPIP
   //LongDIP
   //RingMCP
   //RingPIP
   //RingDIP
   //SmallMCP	
   //SmallPIP
   //SmallDIP
    return angles;
   
  }

  const dotProduct = (v1, v2) =>{
    let result = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    return result; 
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

  return(
    <div className="container-hand-tracker">
    <div>
    <h1>Please Use One Hand</h1>
    <Webcam 
      ref={webCamRef} 
      style={{
        position: "absolute",
        marginRight:"auto",
        marginLeft:"auto",
        left:0,
        right:0,
        textAlign:"center"
      }} 
    />

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

      <div>
        <label className="selection-label">Enter your camera resolution</label>
        <input className="input-box" type="text" placeholder="Default set is 720p" />
        <button className="button-csv" onClick={eventHandler}>Download CSV</button>
      </div>
    </div>
    </div>
  )
}

export default HandTracker;