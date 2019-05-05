// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys

const STRIPE_API_SECRET_KEY = 'YOUR_STRIPE_API_SECRET_KEY';
var stripe = require("stripe")(STRIPE_API_SECRET_KEY);
const express = require("express");
const server = express();
const request = require("request");
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
const port = process.env.PORT || 5000;
server.use(express.static(__dirname + '/public'));
server.listen(port, function () {
    console.log("server is running on port", port);
});
server.set('view engine', 'ejs');
server.get('/', (req, res) => {
    res.render('index');
})


server.get('/success', (req, res) => {
    var postData = {
        'client_secret': STRIPE_API_SECRET_KEY,
        'code': req.query.code,
        'grant_type': 'authorization_code'
    }
    var clientServerOptions = {
        uri: 'https://connect.stripe.com/oauth/token',
        body: JSON.stringify(postData),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    request(clientServerOptions, function (error, response) {
        // show the stripe connect account id 
        console.log(error, response.body);
        return;
    });
    res.send({
        'message': req.query.state
    })
})


server.post('/customer', (req, res) => {
    var json = req.body;
    console.log("stripe token: " + json.stripeToken);
    stripe.customers.create({
        description: 'Customer for jenny.rosen@example.com',
        source: json.stripeToken // obtained with Stripe.js
    }, function (err, customer) {
        // asynchronously called
        if (err) {
            console.log(err);
        }
        console.log(customer);
    });
})


server.get('/charge', (req, res) => {
    stripe.charges.create({
        amount: 1000,
        currency: "cad",
        customer: 'THE_CUSTOMER_ID',
        transfer_data: {
            amount: 877,
            destination: 'STRIPE_CONNECT_ACCOUNT_ID',
        },
    }).then(function (charge) {
        // asynchronously called
        console.log(charge);
    });
})