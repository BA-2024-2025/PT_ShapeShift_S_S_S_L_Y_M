import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import * as service from "./service.js";
import dotenv from "dotenv";
import {makeUser} from "./service.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

let ACCESS_TOKEN='b15a176cadcefb3b6b251d5beb7c02acca602128ce8a11e87f8f03e4cf48ad66ac64429cd8055e4e87ee66bf0cb02ccde0c63521b832dba834d08406396488ff'
let REFRESH_TOKEN='cb96a9370d53168b540e9a51d3bdc34560761c97a56885e8fbc35da19c4958c21e213bfc9806b44700bd8542c04a735edf1eb602489dfe01aade6622d66cd736'

let refreshTokens = [];

app.post('/login', async (req, res) => {
    let user = req.body;
    console.log(req.body);

    if (await service.checkUser(user, res)) {
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, REFRESH_TOKEN);
        refreshTokens.push(refreshToken);
        res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
        res.status(401).json({ error: 'Invalid Credentials' });
    }
});
app.post('/signup', async (req, res) => {
    let user = req.body;
    console.log(req.body);
    try {


        await makeUser(user, res);
    }
    catch (err){
        console.log(err);
        console.log("Failed to make User")
    }
})

app.post('/token', async (req, res) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Invalid Credentials' });
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ error: 'Invalid Credentials' });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid Credentials' });

        const accessToken = generateAccessToken({ name: user.name, email: user.email });
        res.status(200).json({ accessToken: accessToken });
    });
});

app.delete('/logout', async (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);
    res.status(204).send();
});

function generateAccessToken(user) {
    return jwt.sign(
        { email: user.email, password: user.password },
        ACCESS_TOKEN,
        { expiresIn: '21d' }
    );
}

app.listen(4000, () => {
    console.log("Auth Server is Running on Port 4000");
});
