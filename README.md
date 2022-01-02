SMS SDN Flow Management

Personal Communication Services
Department of Computer Science and Information Engineering, National Taiwan University
Server

Run the Node.js server
node server.js
Run the Node.js server continuously
npm install forever
forever start server.js
forever stop 0
Usage (http://[SERVER_IP]:8787)

Check the Global Network State

show
Check the Information of an Individual Device (OpenFlow Switch)

[DEVICE_ID]
E.g., s1, s2, s3, etc.
For example:

s1
Add flow rule

Drop flow

drop [SRC_IP] [DST_IP] [DEVICE_ID]
For example:

drop 10.0.0.1 10.0.0.2 2
SRC_IP = 10.0.0.1
DST_IP = 10.0.0.2
OUTPUT_PORT = {NOACTION}
DEVICE_ID = 2 (of:0000000000000002)
Change flow rule

add [SRC_IP] [DST_IP] [OUTPUT_PORT] [DEVICE_ID]
For example:

add 10.0.0.1 10.0.0.2 3 2
SRC_IP = 10.0.0.1
DST_IP = 10.0.0.2
OUTPUT_PORT = 3
DEVICE_ID = 2 (of:0000000000000002)
Prerequisite

npm install express
npm install twilio
npm install axios
Twilio

Information needed (in Twilio console):

ACCOUNT SID
AUTH TOKEN
TRIAL NUMBER
Parameter Setup

Store Your Twilio Credentials Securely
Usage

Sending Messages
Send an SMS with Twilio’s API
Getting Started with Twilio Webhooks
Receive and Reply to SMS and MMS Messages in Node.js
Testing

SMS same as Postman:


Issue fixed

How to fix “req.body undefined” in Express.js
ONOS

REST API DOCUMENT

http://[ONOS_Controller_IP]:8181/onos/v1/docs/

 Select a repo
