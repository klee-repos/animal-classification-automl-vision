require('dotenv').config();
const automl = require('@google-cloud/automl').v1beta1;

// Create client for prediction service.
const client = new automl.PredictionServiceClient();
const projectId = process.env.AUTOML_PROJECTID;
const computeRegion = `us-central1`;
const modelId = process.env.AUTOML_MODELID;
const scoreThreshold = 0;

import path from 'path'
import fs from 'fs'

var VisionPredict = (filename) => {
  return new Promise(async(resolve, reject) => {
    let visionResults

    let correctLabel = filename.split(/-/g)[0]
    const filePath = path.resolve(`./testimages/${filename}`);
    // Get the full path of the model.
    const modelFullId = client.modelPath(projectId, computeRegion, modelId);
    // Read the file content for prediction.
    const content = fs.readFileSync(filePath, 'base64');
    const params = {};
    if (scoreThreshold) {
      params.scoreThreshold = scoreThreshold;
    }
    // Set the payload by giving the content and type of the file.
    const payload = {};
    payload.image = {imageBytes: content};
    // params is additional domain-specific parameters.
    // currently there is no additional parameters supported.
    try {
      const [response] = await client.predict({
        name: modelFullId,
        payload: payload,
        params: params,
      });
      response.payload.forEach(result => {
        visionResults = {correctLabel, filename, predictedClass: result.displayName, predictedConfidence: result.classification.score}
      });
      resolve(visionResults)
    } catch(err) {
      reject(err)
    }
  })
}

export default VisionPredict;