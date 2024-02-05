const jwt = require('jsonwebtoken')
const express = require('express');
const {auth_with_secret, auth_with_pub_priv} = require('./middleware/auth.js');
const cookieParser = require('cookie-parser')
const fs = require('fs')
const cors = require('cors')
require('dotenv').config()


let CurrentTime = new Date().getTime()
let CurrentDate = new Date(CurrentTime + 2 * 60 * 60 * 1000)


const privateKey = fs.readFileSync('./keys/private.key', 'utf-8')

let issuer = 'my_site.com'
let subject = 'email_of_user@gmail.com'
let audience = 'my_api.com'

const signOptions1 = {
    issuer,
    subject,
    audience,
    expiresIn: "2h",
    algorithm: "HS256" // HMAC with SHA-256
}

const signOptions2 = {
    issuer,
    subject,
    audience,
    expiresIn: "2h",
    algorithm: "RS256" // RSA with SHA-256
}

const user = {
    id: 1,
    username: 'John Doe'
}


const app = express()


app.use(express.json())
app.use(cookieParser())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true)
    next();
});



app.get('/private_with_secret', auth_with_secret, (req, res)=>{
    res.json({secret: 'Hello World!', user: req.user})
});


app.get('/private_pub_priv_key', auth_with_pub_priv, (req, res)=>{
    res.json({secret: 'Hello World!', user: req.user})
})


app.post('/login_with_secret', (req, res)=>{
    
    //Creation of token
    const token = jwt.sign(
        {
            user
        }, 
        process.env.SECRET, // Secret must be as long as the output (256 bits)
        signOptions1
    );

    res.status(202).cookie('jwt', token, {
        expires: CurrentDate,
        httpOnly: true
    }).send("Cookie created");

});


app.post('/login_with_pub_priv_key', (req, res)=>{
    const token = jwt.sign(
        {
            user
        },
        privateKey,
        signOptions2
    )

    res.status(202).cookie('jwt', token, {
        expires: CurrentDate,
        httpOnly: true
    }).send("Cookie created");
})


app.listen(3000, function(){
    console.log('Server listening at 3000');
});
