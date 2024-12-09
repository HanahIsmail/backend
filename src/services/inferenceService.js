const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();

let model;

const loadModel = async () => {
    if (!model) {
        const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
        const modelPath = `gs://${bucketName}/model.json`;
        model = await tf.loadGraphModel(modelPath);
    }
    return model;
};

const predictImage = async (imageBuffer) => {
    const model = await loadModel();

    const image = tf.node.decodeImage(imageBuffer, 3)
        .resizeBilinear([224, 224])
        .expandDims(0)
        .toFloat()
        .div(tf.scalar(255));

    const prediction = model.predict(image).dataSync();
    return prediction[0] > 0.5 ? 'Cancer' : 'Non-cancer';
};

module.exports = { predictImage };
