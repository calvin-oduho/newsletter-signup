import express from "express";
import bodyParser from "body-parser";
import https from "https";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use("/public", express.static("public"));
const dirname = import.meta.dirname;
const port = 3001;


app.get("/", (req, res) => {
    res.sendFile(`${dirname}/signup.html`);      // res.setHeader("content-type", "text/html");
});

app.post("/", (req, res) => {
    
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let emailAddress = req.body.email;
    // console.log(lastName);
    // res.send(`Hello ${firstName.toUpperCase()}! Thank you for signing up to our newsletter via the email: ${emailAddress}`);

    const data = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const apiServer = ''; //Provide your valid Mailchimp API server
    
    const listID = ''; //Provide your valid Mailchimp listID

    const apiKey = ''; //Provide your valid Mailchimp API key
    
    const url = `https://${apiServer}.api.mailchimp.com/3.0/lists/${listID}`; //https://$API_SERVER.api.mailchimp.com/3.0/lists/$list_id/members?skip_merge_validation=false

    const options = {
        method: "POST", 
        auth: apiKey
    };

    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            res.sendFile(`${dirname}/success.html`);
        } 
        else {
            res.sendFile(`${dirname}/failure.html`);
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server running on port ${port}`);
});