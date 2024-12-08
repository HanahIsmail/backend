const { Firestore } = require('@google-cloud/firestore');
require('dotenv').config();

const firestore = new Firestore();
const predictionsCollection = firestore.collection('predictions');

const savePrediction = async (data) => {
    await predictionsCollection.doc(data.id).set(data);
};

module.exports = { savePrediction };