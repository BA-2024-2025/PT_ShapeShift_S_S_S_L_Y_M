import express from 'express';
import * as service from './service.js';
import * as http from "node:http";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';


import swaggerSpec from "./swagger.js";

import {authenticate} from "./middleware.js";

const app = express();
app.use(express.json());
app.use(cors());
const corsOptions = {
    origin: function (reqorigin, callback) {
        // Define an array of allowed origins
        const allowedOrigins = ['*'];

        // Get the origin header from the request
        const origin = req.headers.origin;

        // Check if the origin header is in the allowed origins array
        if (allowedOrigins.includes(origin)) {
            // Allow the request
            callback(null, true);
        } else {
            // Reject the request
            callback(new Error('Not allowed by CORS'));
        }
    }
};


// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.get('/users', async (req , res) => {


    console.log("HELLO")
    console.log(req.path);
    try {
        let response =  service.getAllUsers(req,res);
        console.log(response);

    }
    catch(err) {
        res.status(409).json({error: err});
    }



});


app.get('/users/:anzahl', async (req , res) => {

    let anzahlUsers = parseInt(req.params.anzahl);
    console.log(anzahlUsers)
    try {
        let response = service.getUsersByID(req, res, anzahlUsers);
        console.log(response);

    } catch (err) {
        res.status(409).json({error: err});
    }
})
app.get('/user/findByName/:name', async (req , res) => {

    let name = req.params.name;
    try {
        let response = service.findByName(name, res);
        console.log(response);

    } catch (err) {
        res.status(409).json({error: err});
    }
});


app.post('/user/check-username',authenticate, async (req,res) => {
    let user = req.body;
    console.log(req.body);
    service.checkUserName(user,res);
})


app.post('/user/change_username', authenticate,async (req, res) => {
    const { email } = req.body;
    const { newName } = req.body;
    console.log(req.user.email)
    if(req.user.email !== email){
        res.status(403).json({error: 'Not Allowed to change PW'});
    }
    else {


        let user = req.body;
        service.changeUsername(user, res);
    }
})


app.post('/user/change_password',authenticate, async (req, res) => {
    const { email } = req.body;
    const { newPassword } = req.body;

    if(req.user.email !== email){
        res.status(403).json({error: 'Not Allowed to change PW'});
    }
    else {
        console.log("Hello")
        let user = req.body;
        service.changePassword(user, res);
    }
})

app.post('/user/change_email',authenticate, async (req, res) => {
    const { email } = req.body;
    const { newEmail } = req.body;

    if(req.user.email !== email){
        res.status(403).json({error: 'Not Allowed to change PW'});
    }
    else {
        let user = req.body;
        service.changeEmail(user, res);
    }
})


app.post('/user/change_topscore', authenticate, async (req, res) => {
    const { email } = req.body;
    const { newPassword } = req.body;

    if(req.user.email !== email){
        res.status(403).json({error: 'Not Allowed to change PW'});
    }
    else {
        let user = req.body;
        service.changeTopScore(user, res);
        service.automatic_topscore(user);
    }
})

app.post('/run/insert_score',authenticate, async (req, res) => {
    const { name } = req.body;

    if(req.user.name !== name){
        res.status(403).json({error: 'Not Allowed to change PW'});
    }
    else {
        let user = req.body;
        service.addRun(user, res);
    }
})


app.get('/runs/:id', async (req,res) => {
    console.log("HELLO")
    try{
        let id = req.params.id;
        service.getAllRunsOfUser(res, id);

    }
    catch(err) {
        res.status(409).json({error: err});
    }

})

app.put('/user/setAchievements/:level', authenticate, async (req,res) => {
    const { email } = req.body;

    if(req.user.email !== email){
        res.status(403).json({error: 'Not Allowed to change PW'});
    }
    else {

        let user = req.body;
        let level = req.params.level;
        service.setAchievments(res, user, level);
    }
})

app.post('/user/best_placement/:place', authenticate, async (req,res) => {
    const { email } = req.body;

    if(req.user.email !== email){
        res.status(403).json({error: 'Not Allowed to change PW'});
    }
    else {
        let user = req.body;
        let place = req.params.place
        service.setBestPlace(user, res, place);
    }
})



let server = http.createServer(app);

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});