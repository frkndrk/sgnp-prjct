const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");
require("dotenv").config();

console.log(process.env);


const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url ="https://us18.api.mailchimp.com/3.0/lists/06a0a63971";

    const options = {
        method: "POST",
        auth: process.env.API_KEY
    };

    const request = https.request(url, options, function(response) {
        if(response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();


    
})





app.listen(process.env.PORT || 3000, function() {
    console.log("Server is workin on port 3000");
})



/* api key - newList
2c77aa07325cf30a43539f39488247f0-us18 

id
06a0a63971

*/