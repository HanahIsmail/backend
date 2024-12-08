const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();

let model;

const loadModel = async () => {
    if (!model) {
        const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
        const modelPath = `gs://${bucketName}/model/model.json`;
        model = await tf.loadGraphModel(modelPath);
    }
    return model;
};

module.exports = { loadModel };