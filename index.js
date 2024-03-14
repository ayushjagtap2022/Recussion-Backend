const express = require('express');
const userRouter = require('./Routes/user');
const blogRouter = require('./Routes/data');
const commentRouter = require('./Routes/commments');
const morgan = require('morgan');
const cluster = require('cluster');
const cors = require('cors');
const os = require('os');

cluster.schedulingPolicy = cluster.SCHED_RR;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const app = express();
    app.use(cors());
    app.use(morgan((tokens, req, res) => {
        return [
            `[Worker ${process.pid}]`,
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ');
    }));

    require('./connection/URI');
    app.use('/userapi', userRouter);
    app.use('/blogsapi', blogRouter);
    app.use('/commentapi', commentRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started. Listening on port ${PORT}`);
    });
}
