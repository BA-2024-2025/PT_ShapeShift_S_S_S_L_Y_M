import {expect, test, vi} from "vitest";
import request from "supertest";
import server from "../backend.js";
import authServer from "../authServer"







test('GET /users  should return List of Users', async () => {
    const response = await request(server).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
})

test('GET /users/3 should return List of Users with specified Lenght', async () => {
    const response = await request(server).get('/users/3');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
})

test('GET /user/findByName/:name Returns a list with the User Object of User with this Name'  , async() => {
    const response = await request(server).get('/user/findByName/TLSenZ')
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
})

test('GET /user/findByEmail/:Email Returns a list with the User Object of User with this Email ' , async() => {
    const response = await request(server).get('/user/findByName/c@c.c')
    expect(response.status).toBe(200);

})


test('POST /user/change_username  Changes the Username of this User', async () => {
    const requestBodyLogin = {
        email: "sven@shapeshift.ch",
        password: "Ict-campus09"
    }

    // Send login request
    const tokens = await request(authServer)
        .post('/login')
        .send(requestBodyLogin)
        .set('Content-Type', 'application/json')
        .expect(200)

    // Log the token response to confirm the structure
    console.log("Token Body:", tokens.body);  // Log the entire response body

    // Check if the response contains accessToken and refreshToken
    expect(tokens.body).toHaveProperty('accessToken');
    expect(tokens.body).toHaveProperty('refreshToken');

    // Access the accessToken from the response body
    const accessToken = tokens.body.accessToken;  // Correct way to access the token

    console.log("Access Token:", accessToken);  // Log the accessToken to check if it's defined

    const requestBodyChangeUsername = {
        email: "sven@shapeshift.ch",
        newName: "Thalium",
    }
    const requestBodyChangeUsername2 = {
        email: "sven@shapeshift.ch",
        newName: "SEN Thalium",
    }

    // Check if the access token is correctly passed
    const response = await request(server)
        .post('/user/change_username')
        .send(requestBodyChangeUsername)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

    const response2 = await request(server)
        .post('/user/change_username')
        .send(requestBodyChangeUsername2)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

    // Optional: Log responses to ensure correct behavior
    console.log("Response 1:", response.body);
    console.log("Response 2:", response2.body);
});


test('POST /user/change_email  Changes the email of this User', async () => {
    const requestBodyLogin = {
        email: "sven@shapeshift.ch",
        password: "Ict-campus09"
    }
    const requestBodyLogin2 = {
        email: "sven@hallo.zemp",
        password: "Ict-campus09"
    }

    // Send login request for the first user
    const tokens = await request(authServer)
        .post('/login')
        .send(requestBodyLogin)
        .set('Content-Type', 'application/json')
        .expect(200)

    // Log the token response to confirm the structure
    console.log("Token Body:", tokens.body);  // Log the entire response body

    // Check if the response contains accessToken and refreshToken
    expect(tokens.body).toHaveProperty('accessToken');
    expect(tokens.body).toHaveProperty('refreshToken');

    // Access the accessToken from the response body
    const accessToken = tokens.body.accessToken;  // Correct way to access the token

    console.log("Access Token:", accessToken);  // Log the accessToken to check if it's defined

    // Change email request body
    const requestBodyChangeEmail = {
        email: "sven@shapeshift.ch", // Current email
        newEmail: "sven@hallo.zemp", // New email
    }

    const requestBodyChangeEmail2 = {
        email: "sven@hallo.zemp",  // Current email
        newEmail: "sven@shapeshift.ch", // New email
    }

    // Check if the access token is correctly passed
    const response = await request(server)
        .post('/user/change_email') // Correct endpoint for changing email
        .send(requestBodyChangeEmail)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

    // Log the first response
    console.log("Response 1:", response.body);

    // Now login for the second user to get the new token for them
    const tokens2 = await request(authServer)
        .post('/login')
        .send(requestBodyLogin2)
        .set('Content-Type', 'application/json')
        .expect(200)

    // Get the second access token
    const accessToken2 = tokens2.body.accessToken;
    console.log("Access Token 2:", accessToken2);})  // Log the second accessToken

