import mysql from "mysql2";

let  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'shapeshift',
    multipleStatements: true
})

try{
    connection.connect(function (err, db) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Connected');
        }

    })

    connection.query('Select * from user'),function (err, results) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(results);
        }
    }
}
catch(err){
    console.log(err);
}


function queryPromise(sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

export async function makeUser(user, res) {
    try {
        const result2 = await queryPromise('Select email from user where user.email = ?', [user.email]);
        // Check if user already exists
        const result = await queryPromise('SELECT username FROM user WHERE user.username = ?', [user.name]);

        if (!result.length === 0) {
            res.send("username already taken");
        }
        else if (!result2.length === 0) {
            res.send("Email already taken");
        }
        else {


            await queryPromise('INSERT INTO user (username, password, email) VALUES(?, ?, ?)', [user.name, user.password, user.email]);

            res.status(200).send("User Created Successfully");
        }

        } catch (err) {
            console.error(err);
            res.status(404).json({error: "Create user failed"});
        }

}

let getAllUsersQuery = 'SELECT * FROM user ORDER BY topscore DESC;';


export async function getAllUsers(req, res) {
    console.log(req.query);
    try {

        const results = await new Promise((resolve, reject) => {
            connection.query(getAllUsersQuery, function (err, results) {
                console.log(results);
                if (err) {

                } else {
                    resolve(results); // Resolve the promise with the results
                }
            });
        });
        await res.json(results);
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
}
//Get User by ID
export async function getUsersByID(req, res, id) {
    try {
        // Return a Promise that resolves with the results
        const results = await new Promise((resolve, reject) => {
            connection.query(('Select * From user order by topscore DESC Limit ?'),id , function (err, results) {
                if (err) {
                    reject(err); // Reject the promise if there's an error
                } else {
                    resolve(results); // Resolve the promise with the results
                }
            });
        });
        await res.json(results);
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
}

// Checks if User Exist
export function checkUser(user) {
    return new Promise((resolve, reject) => {
        console.log(user.email, user.password);
        console.log("Query gets done");

        connection.query(
            'SELECT * FROM user WHERE email = ? AND password = ?',
            [user.email, user.password],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return reject(err); // Reject the promise if there's an error
                }

                if (results.length === 0) {
                    console.log("User not found:", results);
                    return resolve(false); // No user found
                } else {
                    console.log("User found:", results);
                    return resolve(true); // User exists
                }
            }
        );
    });
}

// Checks if Just Username Exist
export function checkUserName (user, res) {

    try{
        console.log(user.name);
        connection.query('SELECT * FROM user where username = ? ', [user.name], function (err, results) {
            console.log(results);

            if (results.length === 0){
                res.status(409).json({"exist":false});
            }
            else {
                res.status(200).json({"exist": true});
            }
        })
    } catch(err) {
        res.status(400);
    }
}







const changePasswordQuery = `
    UPDATE user u
    JOIN (SELECT id_user FROM user WHERE email = ?) subquery
    ON u.id_user = subquery.id_user
    SET u.password = ?;
`;

export  function changePassword (user,res) {
    try {
        connection.query(changePasswordQuery, [user.email, user.newPassword], function (err, results) {
            if (err) {
                console.log(err);

            } else {
                res.status(200).send("Password updated successfull");
            }
        })
    } catch (error) {
        res.status(400).send("Something wrong with Request or User does not exist");
    }
}

const changeEmailQuery = `
    UPDATE user SET email = ? WHERE email = ?;
`;


export  function changeEmail (user,res) {
    try {
        connection.query(changeEmailQuery, [user.newEmail, user.email], function (err, results) {
            if (err) {
                console.log(err);

            } else {
                res.status(200).send("email updated successfull");
            }
        })
    } catch (error) {
        res.status(400).send("Something not right with Request or User does not exist");
        console.log(error)
    }
}
const changeUsernameQuery = `
    UPDATE user u
    JOIN (SELECT id_user FROM user WHERE email = ?) subquery
    ON u.id_user = subquery.id_user
    SET u.username = ?;
`;


export  function changeUsername (user,res) {
    try {
        connection.query(changeUsernameQuery, [user.email, user.newName], function (err, results) {
            if (err) {
                console.log(err);

            } else {
                res.status(200).send("Username updated successfull");
            }
        })
    } catch (error) {
        res.status(400).send("Something is not right with your Request or User does not exist");
    }
}

export  function changeTopScore (user,res) {
    try {
        connection.query(changeTopscoreQuery, [user.email, user.topscore], function (err, results) {
            if (err) {
                console.log(err);

            } else {
                res.status(200).send("Score updated successfull");
            }
        })
    } catch (error) {
        res.status(400).send("Number to Large or User does not exist");
    }
}
const changeTopscoreQuery = `
    UPDATE user u
    JOIN (SELECT id_user FROM user WHERE email = ?) subquery
    ON u.id_user = subquery.id_user
    SET u.topscore = ?;
`;



export  function addRun (user,res) {
    try {
        connection.query(addRunQuery, [user.score, user.email, user.level], function (err, results) {
            if (err) {
                console.log(err);

            } else {
                res.status(200).send("Score updated successfull");

            }
        })
    } catch (error) {
        res.status(400).send("Number to Large or User does not exist");
    }
}
let addRunQuery =
    "INSERT INTO runs (score, user_id,level) VALUES (?, (SELECT id_user FROM user WHERE email = ?),?)";

export  function findByName (name,res) {
    try {
        console.log(name)
        connection.query(('Select * from user where username = ?'), name, function (err, results) {
            if (err) {
                console.log(err);

            } else {
                res.status(200).send(results);
            }
        })
    } catch (error) {
        res.status(400).send("Something with your Request is Wrong or User does not exist");
    }
}


export  function findByEmail (email,res) {
    try {
        console.log(email)
        connection.query(('Select * from user where email = ?'), email, function (err, results) {
            if (err) {
                console.log(err);

            } else {
                res.status(200).send(results);
                console.log("Result Querry:" + results);
            }
        })
    } catch (error) {
        res.status(400).send("Something with your Request is Wrong or User does not exist");
    }
}

let automatic_topscoreQuery = ' UPDATE user u JOIN ( SELECT user_id AS id_user, score FROM runs WHERE user_id = (SELECT id_user FROM user WHERE email = ?) ORDER BY score DESC LIMIT 1 ) subquery ON u.id_user = subquery.id_user SET u.topscore = subquery.score WHERE u.email = ?; '

export function automatic_topscore(user){
    console.log(user)
    try {
        connection.query(automatic_topscoreQuery, [user.email, user.email], function (err, results) {
            if (err) console.log(err);
            else {


                console.log("Topscore got sucessfully updatet");
            }
        })
    }catch (error) {
        console.log(error);
    }
}

const getAllRunsOfUserQuery = `
    SELECT r.*
    FROM runs r
    JOIN user u ON r.user_id = u.id_user
    WHERE u.username = ?
`;

export function getAllRunsOfUser(res,name){
    try {
        connection.query(getAllRunsOfUserQuery, [name], function (err, results) {
            if(results.length === 0){
                res.status(404).send("User not found");
            }
            else {
                res.send(results);
            }


        })
    }catch (error) {
        res.status(400).send("Something went wrong");
    }

}

const changeAchievmentsQuery = `
    UPDATE user u
    JOIN (SELECT id_user FROM user WHERE username = ?) subquery
    ON u.id_user = subquery.id_user
    SET u.topscore = ?;
`;

export function setAchievments(res,user,level){
    let query
    try {
        switch (level){
            case "1":
                 query = 'UPDATE user u    JOIN (SELECT id_user FROM user WHERE email = ?) subquery    ON u.id_user = subquery.id_user    SET u.beat_level1 = true'

                break

            case "2":
                 query ='UPDATE user u    JOIN (SELECT id_user FROM user WHERE email = ?) subquery    ON u.id_user = subquery.id_user    SET u.beat_level2 = true'


                break

            case "3":
                query='UPDATE user u    JOIN (SELECT id_user FROM user WHERE email = ?) subquery    ON u.id_user = subquery.id_user    SET u.beat_level3 = true'

                break

            default:
                res.status(404).send("Something went wrong");
        }

        connection.query(query, [user.email], function (err, results) {
            if (err) {
                console.log(err);
            }
            res.status(200).send("OK");
        })

    }catch (error) {
        console.log(error)
        res.status(400).send("Something went wrong");
    }

}

export function setBestPlace(user, res, place){
    try{
        connection.query('UPDATE user u    JOIN (SELECT id_user FROM user WHERE email = ?) subquery    ON u.id_user = subquery.id_user    SET u.best_placement = ?',[user.email, place], function (err, results) {
            res.status(200).send("Update Worked")
        })
    }
    catch (error) {
        res.status(400).send("Something went wrong");
    }
}

