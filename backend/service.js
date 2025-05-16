import mysql from "mysql2";

const {
    DB_HOST = "localhost",
    DB_PORT = 3306,
    DB_USER = "root",
    DB_PASSWORD = "",
    DB_NAME = "",
} = process.env;

const connection = mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true,
});

const PUBLIC_DATA = "id_user,username,email,topscore";

connection.connect((err) => {
    if (err) console.error("DB Connection Error:", err);
    else console.log("Connected to MySQL DB");
});

function queryPromise(sql, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

// CREATE USER
export async function makeUser(user) {
    const emailExists = await queryPromise("SELECT email FROM user WHERE email = ?", [user.email]);
    const usernameExists = await queryPromise("SELECT username FROM user WHERE username = ?", [user.name]);

    if (usernameExists.length > 0) throw new Error("Username already taken");
    if (emailExists.length > 0) throw new Error("Email already taken");

    await queryPromise("INSERT INTO user (username, password, email) VALUES (?, ?, ?)", [
        user.name,
        user.password,
        user.email,
    ]);

    return "User Created Successfully";
}

// GET USERS
export async function getAllUsers() {
    return queryPromise(`SELECT ${PUBLIC_DATA} FROM user ORDER BY topscore DESC`);
}

export async function getUsersLimited(id) {
    return queryPromise(`SELECT ${PUBLIC_DATA} FROM user ORDER BY topscore DESC LIMIT ?`, [Number(id)]);
}

// AUTH
export async function checkUser(user) {
    const results = await queryPromise(
        `SELECT ${PUBLIC_DATA} FROM user WHERE email = ? AND password = ?`,
        [user.email, user.password]
    );
    return results.length > 0;
}

// USERNAME EXIST
export async function checkUserName(user) {
    const results = await queryPromise(`SELECT ${PUBLIC_DATA} FROM user WHERE username = ?`, [user.name]);
    return results.length > 0;
}

// UPDATE PASSWORD
export async function changePassword(user) {
    const sql = `
        UPDATE user u
        JOIN (SELECT id_user FROM user WHERE email = ?) sub
        ON u.id_user = sub.id_user
        SET u.password = ?;
    `;
    await queryPromise(sql, [user.email, user.newPassword]);
    return "Password updated successfully";
}

// UPDATE EMAIL
export async function changeEmail(user) {
    await queryPromise("UPDATE user SET email = ? WHERE email = ?", [user.newEmail, user.email]);
    return "Email updated successfully";
}

// UPDATE USERNAME
export async function changeUsername(user) {
    const sql = `
        UPDATE user u
        JOIN (SELECT id_user FROM user WHERE email = ?) sub
        ON u.id_user = sub.id_user
        SET u.username = ?;
    `;
    await queryPromise(sql, [user.email, user.newName]);
    return "Username updated successfully";
}

// UPDATE TOPSCORE
export async function changeTopScore(user) {
    const sql = `
        UPDATE user u
        JOIN (SELECT id_user FROM user WHERE email = ?) sub
        ON u.id_user = sub.id_user
        SET u.topscore = ?;
    `;
    await queryPromise(sql, [user.email, user.topscore]);
    return "Score updated successfully";
}

// ADD RUN
export async function addRun(user) {
    const sql = `INSERT INTO runs (score, user_id, level, time) VALUES (?, (SELECT id_user FROM user WHERE email = ?), ?, ?)`;
    const now = new Date();
    await queryPromise(sql, [user.score, user.email, user.level, now]);
    return "Run added successfully";
}

// FIND BY NAME/EMAIL
export async function findByName(name) {
    return queryPromise(`SELECT ${PUBLIC_DATA} FROM user WHERE username = ?`, [name]);
}

export async function findByEmail(email) {
    return queryPromise(`SELECT ${PUBLIC_DATA} FROM user WHERE email = ?`, [email]);
}

// AUTO TOPSCORE
export async function automatic_topscore(user) {
    const sql = `
        UPDATE user u
            JOIN (
            SELECT user_id, score
            FROM runs
            WHERE user_id = (SELECT id_user FROM user WHERE email = ?)
            ORDER BY score DESC
            LIMIT 1
            ) subquery
        ON u.id_user = subquery.user_id
        SET u.topscore = subquery.score
        WHERE u.email = ?;
    `;
    await queryPromise(sql, [user.email, user.email]);
    return "Topscore updated automatically";
}

// GET USER RUNS
export async function getAllRunsOfUser(name) {
    const sql = `
        SELECT r.* FROM runs r
        JOIN user u ON r.user_id = u.id_user
        WHERE u.username = ?
        ORDER BY r.time DESC
        LIMIT 10;
    `;
    return queryPromise(sql, [name]);
}

// ACHIEVEMENT
export async function changeUserAchievements(user, level) {
    const allowedLevels = ["1", "2", "3"];
    if (!user?.email || !allowedLevels.includes(level)) {
        throw new Error("Invalid user or level");
    }

    const columnMap = {
        "1": "beat_level1",
        "2": "beat_level2",
        "3": "beat_level3"
    };

    const columnName = columnMap[level];
    const sql = `
        UPDATE user u
        JOIN (SELECT id_user FROM user WHERE email = ?) sub
        ON u.id_user = sub.id_user
        SET u.${columnName} = TRUE;
    `;

    await queryPromise(sql, [user.email]);
    return `Achievement for level ${level} set`;
}
