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
    const data=[];
    //Determines the time stamp of each dataset 
    const endTime = Date.now();
    const deltaTime = endTime - startTime;
    data.push(deltaTime);
    //Iterate through the array of landmarks which contain 21 distinct sets of points
    for(let i=0; i<21; i++){
      //Retrieve the x, y, z points of each landmark 
      const xVal = objArr.multiHandLandmarks[0][i].x;
      const yVal = objArr.multiHandLandmarks[0][i].y;
      const zVal = objArr.multiHandLandmarks[0][i].z;
      //Push the points to an array reducing to 6 decimal points 
      data.push(xVal.toFixed(6), yVal.toFixed(6), zVal.toFixed(6));
    }
    //Push the set of data into a static array 
    LandMarkData.push(data);
    console.log(LandMarkData);
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
      className="output_canvas"
      style={{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        zindex: 9,
        width: 640,
        height: 480,
      }} 
      />
      
    </div>

    <div className="container-data">
      <div>
        <h2>Landmark_0</h2>
        <p>X: {digit_x}</p>
        <p>Y: {digit_y}</p>
        <p>Z: {digit_z}</p>
        <p>Number of datasets recorded: {countData(LandMarkData)}</p>
        <button className="button-csv" onClick={eventHandler}>Download CSV</button>
      </div>

      <div>
        
      </div>
      
    </div>
    </div>
  )
}

export default HandTracker;