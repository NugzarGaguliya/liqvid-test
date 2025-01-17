import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import * as faceapi from 'face-api.js';

import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

import './index.css';

const path = require("path");

let MODEL_URL = "/models";
let DB_PATH = "db.json";

if (process.env.NODE_ENV === "production") {
  MODEL_URL = path.join(process.resourcesPath, "app.asar", 'build/models');
}

const db = low(new FileSync(DB_PATH));

db.defaults({images: []}).write();

faceapi.env.monkeyPatch({
  Canvas: HTMLCanvasElement,
  Image: HTMLImageElement,
  ImageData: ImageData,
  Video: HTMLVideoElement,
  createCanvasElement: () => document.createElement('canvas'),
  createImageElement: () => document.createElement('img')
});

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
}

loadModels().then(() => {
  ReactDOM.render(<App db={db}/>, document.getElementById('root'));
});
