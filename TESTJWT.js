import express from "express";
import  Jwt  from "jsonwebtoken";
const port = 3000;
const server = express();
server.get("/", (req,res) => {
    res.send(`<h1> Intro a JSON WEB TOKEN </h1>`)
})

server.post("/loginJWT", (req,res) => {
    const user={
        id:1, 
        name: "Peter elBorracho",
        email: "PeterBorracho@hotmail.com"
    }
})
Jwt.sign({user}), "miclavesupersegura", {expiresIn: '1h'}, (err,token) =>{
    err?console.log(err) : res.json(token);
}


server.listen(port, (err)=> {
    err ? console.log(`Server launch error: ${err}` ) : console.log (`Server running on http://localhost:3000/`)
});