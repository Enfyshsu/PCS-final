const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const axios = require('axios');
const app = express();
var __dirname = 'views';
const switchMap = { "of:0000000000000001": "s1", "of:0000000000000002": "s2", "of:0000000000000003": "s3", "of:0000000000000004": "s4", "of:0000000000000005": "s5", "of:0000000000000006": "s6", "of:0000000000000007": "s7", "of:0000000000000008": "s8", "of:0000000000000009": "s9" };
const mapSwitch = { "s1": "of:0000000000000001", "s2": "of:0000000000000002", "s3": "of:0000000000000003", "s4": "of:0000000000000004", "s5": "of:0000000000000005", "s6": "of:0000000000000006", "s7": "of:0000000000000007", "s8": "of:0000000000000008", "s9": "of:0000000000000009" };
const detail = require('./detail.json');
const accountSid = detail.ACCOUNT_SID;
const authToken = detail.AUTH_TOKEN;
const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

var currDeviceFlow = {},
    prevDeviceFlow = {};

setInterval(updateCurr, 5000);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/css', express.static('css'));

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    checkContent(req.body.Body, res, twiml);
});

async function checkContent(contents, res, twiml) {
    console.log(contents);
    var SMS_reply_body;
    if (contents == "show") {
        SMS_reply_body = showAllDevice();
    } else if (contents in mapSwitch) {
        SMS_reply_body = sendDeviceFlow(mapSwitch[contents]);
    } else if (contents.indexOf("drop") > -1) {
        var [ACTION, SRC_IP, DST_IP, DEVICE_ID] = contents.split(" ");
        await ruleChange(SRC_IP, DST_IP, ACTION, DEVICE_ID);
        SMS_reply_body = "Flow dropped!";
    } else if (contents.indexOf("add") > -1) {
        var [ACTION, SRC_IP, DST_IP, OUT_PORT, DEVICE_ID] = contents.split(" ");
        await ruleChange(SRC_IP, DST_IP, OUT_PORT, DEVICE_ID);
        SMS_reply_body = "Flow add!";
    } else {
        SMS_reply_body = "Usage error!";
    }
    res.send(SMS_reply_body);
    // sendSMS(SMS_reply_body);
}

function sendSMS(SMS_reply_body) {
    client.messages
        .create({
            body: SMS_reply_body,
            to: detail.MY_NUMBER,
            from: detail.TRIAL_NUMBER,
        })
        .then((message) => console.log(message.sid));
    return Promise.resolve("hello");
}

function showAllDevice() {
    console.log(currDeviceFlow);
    if (Object.keys(prevDeviceFlow).length) {
        var deviceData = "";
        for (const [key, value] of Object.entries(currDeviceFlow)) {
            deviceData += (switchMap[key] + ": " + Math.max(0, value.bytes - prevDeviceFlow[key].bytes) + " bytes\n");
        }
        return deviceData;
    } else {
        return "not yet";
    }
    // return Promise.resolve("hello");
}

function sendDeviceFlow(device) {
    if (Object.keys(currDeviceFlow).length) {
        var deviceData = "";
        deviceData += (switchMap[device] + ":\n");
        let flows = currDeviceFlow[device].flows;
        for (var i = 0; i < flows.length; i++) {
            deviceData += "SRC_IP: " + flows[i].SRC_IP.split('/')[0] +
                ", DST_IP: " + flows[i].DST_IP.split('/')[0] +
                ", bytes: " + (flows[i].BYTES - prevDeviceFlow[device].flows[i].BYTES) + "\n";
        }
        return deviceData;
    } else {
        return "not yet";
    }
    // return Promise.resolve("hello");
}

function ruleChange(SRC_IP, DST_IP, ACTION, DEVICE_ID) {
    var write_json = exec('python3 write_rule.py ' + SRC_IP + " " + DST_IP + " " + ACTION + " " + DEVICE_ID,
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    return Promise.resolve("hello");
}

function updateCurr() {
    prevDeviceFlow = currDeviceFlow;
    currDeviceFlow = {};
    var config = {
        method: 'get',
        url: detail.ONOS_URL + '/onos/v1/flows',
        headers: {
            'Authorization': 'Basic b25vczpyb2Nrcw==',
            'Cookie': 'JSESSIONID=node0fsabod7iitsuwiz57slklayl0.node0'
        }
    };

    axios(config)
        .then(function(response) {
            var flows = response.data.flows;
            // var flowNum = flows.length;
            for (var i = 0; i < flows.length; i++) {
                if (flows[i].selector.criteria[0].ethType != "0x800") continue;
                // if (flows[i].appId != "org.onosproject.rest") { console.log(flows[i].appId); continue; }
                perFlow = {
                    "FLOW_ID": flows[i].id,
                    "SRC_IP": flows[i].selector.criteria[1].ip,
                    "DST_IP": flows[i].selector.criteria[2].ip,
                    "BYTES": flows[i].bytes
                };
                if (!currDeviceFlow[flows[i].deviceId]) {
                    currDeviceFlow[flows[i].deviceId] = {};
                    currDeviceFlow[flows[i].deviceId].bytes = 0;
                }
                currDeviceFlow[flows[i].deviceId].bytes += flows[i].bytes;
                (currDeviceFlow[flows[i].deviceId].flows || (currDeviceFlow[flows[i].deviceId].flows = [])).push(perFlow);
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}

http.createServer(app).listen(8787, () => {
    console.log('Express server listening on port 8787');
});

app.get('/', function(req, res) {
    res.sendFile('home.html', { root: __dirname });
});

app.get('*', function(req, res) {
    res.send('404 not found');
});