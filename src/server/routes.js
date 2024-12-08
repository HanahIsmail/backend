const { predictHandler, getPredictionHistoriesHandler } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/predict',
        handler: predictHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                maxBytes: 1000000,
                output: 'stream',
                parse: true,
            },
        },
    },
    {
        method: 'GET',
        path: '/predict/histories',
        handler: getPredictionHistoriesHandler,
    },
];

module.exports = routes;