let express = require('express');
let bodyParser = require('body-parser');
let nodemailer = require('nodemailer');
let request = require('request');
const config = require('./conf.json');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/sendMail',function(req,res,next){

    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
    }

    let user = null;

    config.users.forEach(function(element,idx,array){
        if(req.body['website'] === element.website){
            user = element;
        }
        if (idx === array.length - 1 && user == null){
            res.json({"responseCode" : 2,"responseDesc" : "Website '"+element.website+"' not configured"});
        }
    });

    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + user.recapthaSecretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

    request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        if(body.success !== undefined && !body.success) {
            return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
        }

        let transporter = nodemailer.createTransport({
            service: config.transport.service,
            auth: {
                user: config.transport.user,
                pass: config.transport.pass
            }
        });

        let mailOptions = {
            from: req.body['email'], // Sender address
            to: user.email, // List of receivers
            subject: 'Messsage from '+req.body['firstname']+' '+req.body['lastname'], // Subject line
            html: '<br/>Contact email : <br/>'+req.body['email']+'<br/>Message : <br/>'+req.body['message'], // Html body
        };

        transporter.sendMail(mailOptions, function (err, responseStatus) {
            if(err != null){
                console.log(err);
            }
            transporter.close();
        });
        res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
    });
});

// lifting the app on port 3000.
app.listen(3000, function () {
    console.log('ExpressMailer web server listening on port 3000')
});