const { v4: uuidv4 } = require('uuid');
const { predictImage } = require('../services/inferenceService');
const { Firestore } = require('@google-cloud/firestore');
require('dotenv').config();

const firestore = new Firestore();
const predictionsCollection = firestore.collection('predictions');

// Handler for POST /predict
const predictHandler = async (request, h) => {
    try {
        const { file } = request.payload;

        if (!file) {
            throw new Error('Image file is required');
        }

        const size = file._data.length;
        if (size > 1000000) {
            return h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000',
            }).code(413);
        }

        const result = await predictImage(file._data);
        const id = uuidv4();
        const createdAt = new Date().toISOString();
        const suggestion = result === 'Cancer'
            ? 'Segera periksa ke dokter!'
            : 'Penyakit kanker tidak terdeteksi.';

        const predictionData = { id, result, suggestion, createdAt };
        await predictionsCollection.doc(id).set(predictionData);

        return {
            status: 'success',
            message: 'Model is predicted successfully',
            data: predictionData,
        };
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        }).code(400);
    }
};

// Handler for GET /predict/histories
const getPredictionHistoriesHandler = async (request, h) => {
    try {
        const snapshot = await predictionsCollection.get();

        if (snapshot.empty) {
            return {
                status: 'success',
                data: [],
            };
        }

        const histories = [];
        snapshot.forEach((doc) => {
            histories.push({
                id: doc.id,
                history: doc.data(),
            });
        });

        return {
            status: 'success',
            data: histories,
        };
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Gagal mengambil data riwayat prediksi',
        }).code(500);
    }
};

module.exports = { predictHandler, getPredictionHistoriesHandler };