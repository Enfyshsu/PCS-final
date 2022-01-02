# SMS SDN Flow Management
> Personal Communication Services
> Department of Computer Science and Information Engineering, National Taiwan University

## Server
* Run the Node.js server
```sh
node server.js
```

* Run the Node.js server continuously
```sh
npm install forever
```

```sh
forever start server.js
forever stop 0
```

## Usage (http://[SERVER_IP]:8787)
### Check the Global Network State
```sh
show
```
### Check the Information of an Individual Device (OpenFlow Switch)
```sh
[DEVICE_ID]
```
E.g., s1, s2, s3, etc.
For example:
```sh
s1
```
### Add flow rule
#### Drop flow
```sh
drop [SRC_IP] [DST_IP] [DEVICE_ID]
```
For example:
```sh
drop 10.0.0.1 10.0.0.2 2
```
```
SRC_IP = 10.0.0.1
DST_IP = 10.0.0.2
OUTPUT_PORT = {NOACTION}
DEVICE_ID = 2 (of:0000000000000002)
```
#### Change flow rule
```sh
add [SRC_IP] [DST_IP] [OUTPUT_PORT] [DEVICE_ID]
```
For example:
```sh
add 10.0.0.1 10.0.0.2 3 2
```
```
SRC_IP = 10.0.0.1
DST_IP = 10.0.0.2
OUTPUT_PORT = 3
DEVICE_ID = 2 (of:0000000000000002)
```
## Prerequisite
```sh
npm install express
```
```sh
npm install twilio
```
```sh
npm install axios
```
## Twilio
Information needed (in Twilio console):
* ACCOUNT SID
* AUTH TOKEN
* TRIAL NUMBER

### Parameter Setup
* [Store Your Twilio Credentials Securely](https://www.twilio.com/docs/usage/secure-credentials)

### Usage
* [Sending Messages](https://www.twilio.com/docs/sms/send-messages)
* [Send an SMS with Twilio’s API](https://www.twilio.com/docs/usage/api#send-an-sms-with-twilios-api)
* [Getting Started with Twilio Webhooks](https://www.twilio.com/docs/usage/webhooks/getting-started-twilio-webhooks)
* [**Receive and Reply to SMS and MMS Messages in Node.js**](https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-node-js#)


### Testing
SMS same as Postman:
![](https://i.imgur.com/K98m4o0.png)



### Issue fixed
* [How to fix "req.body undefined" in Express.js](https://akhromieiev.com/req-body-undefined-express/)


## ONOS

#### REST API DOCUMENT
http://[ONOS_Controller_IP]:8181/onos/v1/docs/
