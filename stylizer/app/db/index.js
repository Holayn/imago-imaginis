const fs = require('fs');
//const request = require('request');
const request = require('request-promise-native');
const config = require('../../config.js');

const selectImagePath = 'style/selectImage';
const insertImagePath = 'style/insertImage';
const selectRunPath = 'style/selectRun';
const insertRunPath = 'style/insertRun';

const log = (msg) => {console.log("DB: " + msg)};

module.exports = {

  /**
   * Retrieve an image from the database
   * type: [ 'content' | 'style' ]
   */
  selectImage: async function(imageType, photo_id) {
    let options = {
      form: {
        photo_id: photo_id,
        type: imageType
      },
      url: config.dbUrl +'/'+ selectImagePath,
      method: 'POST',
      encoding: null,
      headers: { 'Content-Type': 'multipart/form-data'}
    };

    let filename = 'UNSET';
    if (imageType === 'content') {
      filename = `${config.contentPath}/${photo_id}.jpg`;
    } else if (imageType === 'style') {
      filename = `${config.stylePath}/${photo_id}.jpg`;
    } else {
      throw new Error('Unknown type: ' + imageType);
    }
    await request(options, async (err, res, body) => {

      // TODO: The error handling here does not work for DB side error
      if (err) {
        log(err);
        return;
      } else if (body.length === 0) {
        log ("ERROR: Empty file received.");
        return;
      }
      
      log(`Writing ${filename}`);
      await fs.writeFile(filename, body, (err) => {
        if (err) {
          log(err);
          return -1;
        }
        return;
      });
      return;
    });
    return filename;
  },

  // Load an image into the database
  insertImage: async function(outputFPath, photo_id) {
    //let imagePath = `${config.outputPath}/${photo_id}.jpg`;
    fs.readFile(outputFPath, async (err, data) => {
      if (err) {
        console.log(`Could not read image ${outputFPath}.`);
        return;
      }

      options = { 
        form: {
          imageData: data,
          photo_id: photo_id
        },
        url: `${config.dbUrl}/${insertImagePath}`,
        encoding: null,
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data'},
      };

      await request(options, (err, res, body) => {
        if (err) {
          log(err);
        }
        console.log('send complete');
      });
    });

    return 0;
  },

  // Get run information from database
  selectRun: async function(upId) {
    let options = {
      form: { user_id: upId[0], photo_id: upId[1] },
      url: config.dbUrl +'/'+ selectRunPath,
      method: 'POST',
      encoding: null,
      headers: { 'Content-Type': 'multipart/form-data'}
    };

    let result = await request(options, (err, res, body) => {
      if (err) {
        log(err);
        return;
      } else if (body.length === 0) {
        log ("ERROR: Empty response received.");
        return;
      }
      return body;
    });

    return result;
  },

  // Send run information to database
  insertRun: async function(run) {
    options = { 
      body: run,
      url: `http://localhost:8001/${sendImagePath}`,
      encoding: null,
      method: 'POST',
      headers: { 'Content-Type': 'application/json'}
    };
    request(options, (err, res, body) => {
      console.log('send complete');
    });
  }
}
