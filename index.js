const axios = require('axios');
const express = require('express');
const app = express();
const cors = require('cors');

require("dotenv").config();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

const baseurl = process.env.BASE_URL;
let token = process.env.TOKEN;

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' // You can set other headers as needed
};



app.post('/', async (req, res) => {
    const { login_id, password } = req.body;
    const bearer = await axios.post("https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp", { login_id, password });
    res.status(200).send(token);
})

app.post('/register', async (req, res) => {
    const { first_name, last_name, street, address, city, state, email, phone } = req.body;
    const data = { first_name, last_name, street, address, city, state, email, phone };
    await axios.post(`${baseurl}?cmd=create`, data, { headers });
    // console.log(req.body);
    res.status(200).send("done");

})

app.get('/show', async (req, res) => {
    try {
        const response = await axios.get(`${baseurl}?cmd=get_customer_list`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'  
        }});
    }
    catch (e) {
        res.status(404).send("no data");
    }
    const data = response.data;
    res.send(data);
})

app.post('/delete/:uuid', async (req, res) => {
    const { uuid } = req.params;
    const response = await axios.post(`${baseurl}?cmd=delete&uuid=${uuid}`, null, { headers });
    res.send("success");
})

app.post('/update/:uuid', async (req, res) => {
    const { uuid } = req.params;
    const { first_name, last_name, street, address, city, state, email, phone } = req.body;
    const data = { first_name, last_name, street, address, city, state, email, phone }; 
    const response = await axios.post(`${baseurl}?cmd=update&uuid=${uuid}`, data, { headers });
    res.send("success");
})

app.listen(3001, (req, res) => {
    console.log("listening on port 3001");
})