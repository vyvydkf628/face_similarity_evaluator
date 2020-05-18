import * as faceapi from 'face-api.js';

import { canvas, faceDetectionNet, faceDetectionOptions, saveFile } from './commons';


async function evalSimilarity(imageRef, imageQuery) {

  await faceDetectionNet.loadFromDisk('./weights')
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./weights')
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./weights')

  const referenceImage = await canvas.loadImage(imageRef)
  const queryImage = await canvas.loadImage(imageQuery)

  const resultsRef = await faceapi.detectSingleFace(referenceImage, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptor()

  const resultsQuery = await faceapi.detectSingleFace(queryImage, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptor()

  const faceMatcher = new faceapi.FaceMatcher(resultsRef)
  const bestMatch = faceMatcher.findBestMatch(resultsQuery.descriptor)
  
  return bestMatch.distance
}

export { evalSimilarity }