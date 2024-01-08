const jwt = require('jsonwebtoken')
const fs = require('fs')


const publicKey = fs.readFileSync('./keys/public.key', 'utf-8')

const auth_with_secret = (req, res, next)=>{
    const token = req.cookies.jwt
    if (!token){
        return res.status(401).send("Access Denied. No token provided.")
    }
    try {
        const decoded = jwt.verify(
            token, 
            process.env.SECRET,
            {
                algorithms:['HS256']
            }
        )
        req.user = decoded.user
        next()
    } catch (error) {
        res.status(400).send("Invalid token")
    }
}

const auth_with_pub_priv = (req, res, next)=>{
    const token = req.cookies.jwt
    if (!token){
        return res.status(401).send("Access Denied. No token provided.")
    }
    try {
        const decoded = jwt.verify(
            token, 
            publicKey,
            {
                algorithms:['RS256'] //very imp to specify the algorithm 
            }
        )
        req.user = decoded.user
        next()
    } catch (error) {
        res.status(400).send("Invalid token")
    }
}
module.exports = {auth_with_secret, auth_with_pub_priv}