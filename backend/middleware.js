import jwt from 'jsonwebtoken';

let ACCESS_TOKEN='b15a176cadcefb3b6b251d5beb7c02acca602128ce8a11e87f8f03e4cf48ad66ac64429cd8055e4e87ee66bf0cb02ccde0c63521b832dba834d08406396488ff'
let REFRESH_TOKEN='cb96a9370d53168b540e9a51d3bdc34560761c97a56885e8fbc35da19c4958c21e213bfc9806b44700bd8542c04a735edf1eb602489dfe01aade6622d66cd736'
export function authenticate(req, res, next) {
     const authHeader = req.headers.authorization;
     console.log(authHeader);
     const token = authHeader && authHeader.split(' ')[1];
     if (token == null || token === '') {
         return res.status(403).send('No token provided');
     }
     else{
     jwt.verify(token, ACCESS_TOKEN, (err, user) => {
         console.log(user);
         if (err) return res.status(403).send("Token no longer valid");
         req.user = user;
         next();
     })}
 }