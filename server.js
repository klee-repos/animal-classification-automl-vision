require('dotenv').config();
const PORT = 4050

import express from 'express';
const app = express();
const server = require('http').createServer(app);

import bodyParser from 'body-parser';
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

import fs from 'fs'
import os from 'os'
import {VisionPredict} from './AutoML'
import Papa from 'papaparse'

app.post('/VisionPredict', async(req, res) => {
  var output = []
  fs.readdir('./testimages', async(err, items) => {
    for (let i in items) {
      console.log(items[i]);
      if (items[i] !== '.DS_Store') {
        let visionResults = await VisionPredict(items[i])
        if (visionResults) {
          output.push(visionResults)
          console.log(visionResults)
        }
      }   
      let csv = Papa.unparse(output)
      fs.writeFileSync(`OutputFiles/prediction.csv`, csv);
    }
  })
	res.sendStatus(200)
})

server.listen(process.env.PORT || PORT, function() {
	console.log(`Node server started on port ${PORT}`)
});