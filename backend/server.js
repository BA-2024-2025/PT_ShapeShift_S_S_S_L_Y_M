import express from 'express';
import cors from 'cors';
import http from 'node:http';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { Worker } from 'worker_threads';

import * as service from './service.js';
import swaggerSpec from './swagger.js';
import { authenticate } from './middleware.js';

// Spawn workers
const worker = new Worker("./livechat-server.js");
const worker2 = new Worker("./authServer.js");

// Allowed origins for CORS (exact match, no trailing slash)
const allowedOrigins = ['https://shapeshift.themodcraft.net'];

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Reject requests with no origin (e.g., Postman, curl)
        if (!origin) {
            return callback(new Error('No Origin header, access denied'));
        }

        // Normalize origin for case-insensitive comparison
        const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();

        if (allowedOrigins.some(o => o.toLowerCase() === normalizedOrigin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS origin denied'));
        }
    },
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware to authorize based on email in req.user and req.body
const authorizeByEmail = (req, res, next) => {
    if (!req.user || req.user.email !== req.body.email) {
        return res.status(403).json({ error: 'Forbidden: Invalid email owner' });
    }
    next();
};

const authorizeByName = (req, res, next) => {
    if (!req.user || req.user.name !== req.body.name) {
        return res.status(403).json({ error: 'Forbidden: Invalid user' });
    }
    next();
};

// Helper to handle async route errors and avoid multiple responses
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes using asyncHandler for clean error handling
app.get('/users', asyncHandler(async (req, res) => {
    try {
        const users = await service.getAllUsers();
        res.json(users);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }}));

app.get('/users/:anzahl', async (req, res) => {
    try {
        const count = parseInt(req.params.anzahl) || 3;
        const response = await service.getUsersLimited(req, res, count);
        res.json(response);
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
});


app.get('/user/findByName/:name', asyncHandler(async (req, res) => {
    const user = await service.findByName(req.params.name);
    res.json(user);
}));

app.get('/user/findByEmail/:email', asyncHandler(async (req, res) => {
    const user = await service.findByEmail(req.params.email);
    res.json(user);
}));

app.post('/user/check-username', authenticate, asyncHandler(async (req, res) => {
    const result = await service.checkUserName(req.body);
    res.json(result);
}));

app.post('/user/change_username', authenticate, authorizeByEmail, asyncHandler(async (req, res) => {
    const result = await service.changeUsername(req.body);
    res.json(result);
}));

app.post('/user/change_password', authenticate, authorizeByEmail, asyncHandler(async (req, res) => {
    const result = await service.changePassword(req.body);
    res.json(result);
}));

app.post('/user/change_email', authenticate, authorizeByEmail, asyncHandler(async (req, res) => {
    const result = await service.changeEmail(req.body);
    res.json(result);
}));

app.post('/user/change_topscore', authenticate, authorizeByEmail, asyncHandler(async (req, res) => {
    const result = await service.changeTopScore(req.body);
    res.json(result);
}));

app.post('/run/insert_score', authenticate, authorizeByName, asyncHandler(async (req, res) => {
    const user = req.body;
    await service.addRun(user);
    await service.automatic_topscore(user);
    await service.changeUserAchievements(user);
    res.json({ success: true });
}));

app.get('/runs/:id', asyncHandler(async (req, res) => {
    const runs = await service.getAllRunsOfUser(req.params.id);
    res.json(runs);
}));

app.put('/user/setAchievements/:level', authenticate, authorizeByEmail, asyncHandler(async (req, res) => {
    const { level } = req.params;
    const result = await service.setAchievments(req.body, level);
    res.json(result);
}));

app.post('/user/best_placement/:place', authenticate, authorizeByEmail, asyncHandler(async (req, res) => {
    const result = await service.setBestPlace(req.body, req.params.place);
    res.json(result);
}));

// Global error handler to catch errors passed by asyncHandler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.message && err.message.includes('CORS')) {
        return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start HTTP server
const server = http.createServer(app);
server.listen(3000, () => {
    console.log('[STATUS]: Server running on port 3000');
});

export default app;
