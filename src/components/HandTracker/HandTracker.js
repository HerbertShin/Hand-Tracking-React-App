import React from 'react';
import './HandTracker.css';
import Webcam from 'react-webcam';
import {Hands} from '@mediapipe/hands'; 
//import * as hands from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import {useRef, useEffect, useState} from 'react';

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
      let innerValue = dataObject[o]===null?'':dataObject[o].toString();
      let result = innerValue.replace(/"/g, '""');
      result = '"' + result + '"';
      dataArray.push(result);
  }
  return dataArray.join(' ') + '\r\n';
}



  const downloadCSV = (arrayOfObjects) =>{
    if (!arrayOfObjects.length) {
      return;
  }
  var csvContent = "data:text/csv;charset=utf-8,";
  csvContent += objectToCSVRow(Object.keys(arrayOfObjects[0]));
  arrayOfObjects.forEach(function(item){
      csvContent += objectToCSVRow(item);
  }); 
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "landmarkData.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  }

  const jsonToCSV = (objArr) =>{
    const LandMarkData = [];
    for(let i=0; i<21; i++){
      const data=[];
      const key = i;
      const xVal = objArr.multiHandLandmarks[0][i].x;
      const yVal = objArr.multiHandLandmarks[0][i].y;
      const zVal = objArr.multiHandLandmarks[0][i].z;
      data.push(key, xVal, yVal, zVal);
      LandMarkData.push(data);
      
    }
    console.log(LandMarkData);
    //downloadCSV(LandMarkData);
  }

  const onResults = (results)=>{
    if(results.multiHandLandmarks){
      const x = results.multiHandLandmarks[0][0].x;
      const y = results.multiHandLandmarks[0][0].y;
      const z = results.multiHandLandmarks[0][0].z;
      
      setDigit_x(x);
      setDigit_y(y);
      setDigit_z(z);

      jsonToCSV(results);
      console.log(results);

    }
  }
  
  useEffect(()=>{
    const hands = new Hands({
      locateFile:(file)=>{
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.3.1626903359/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
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
      />
      
    </div>

    <div className="container-data">
      <div>
        <h2>Landmark_0</h2>
        <p>X: {digit_x}</p>
        <p>Y: {digit_y}</p>
        <p>Z: {digit_z}</p>
      </div>

      <div>
        
      </div>
      
    </div>
    </div>
  )
}

export default HandTracker;