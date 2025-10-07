import express from "express";
import bodyParser from "body-parser";
import axios from "axios";


export default function createMetaServicesRoute(geminiService) {

    const router = express.Router();

    // Webhook verification endpoint
    router.get('/webhook', bodyParser.json(), (req, res) => {
        const VERIFY_TOKEN = "6ff371d3192ab321495e85bc7e6d69e7"

        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];

        if (mode && token) {
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log('META MESSENGER WEBHOOK_VERIFIED');
                res.status(200).send(challenge);
            } else {
                res.sendStatus(403);
            }
        }
    });

    // Handle incoming messages/events
    router.post('/webhook', bodyParser.json(), async (req, res) => {
        console.log(JSON.stringify(req.body))

        const incomingMessageObj = req.body.entry[0].messaging[0];



        if (incomingMessageObj.message) {
            const senderId = incomingMessageObj.sender.id;
            const incomingMessage = incomingMessageObj.message.text;

            if (incomingMessage.length < 8) {
                return
            }

            try {
                const messengerPageAccessToken = '';
                const messageText = await geminiService.generateOneTimeResponse(incomingMessage)
                const apiUrl = 'https://graph.facebook.com/v21.0/me/messages';

                const requestBody = {
                    recipient: { id: senderId },
                    message: { text: messageText }
                };

                const response = await axios.post(apiUrl, requestBody, {
                    headers: {
                        'Authorization': `Bearer ${messengerPageAccessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Facebook Messenger message sent successfully!');
                console.log('Response data:', response.data);
            } catch (error) {
                console.error('Error sending Facebook Messenger message:');
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Error Data:', error.response.data);
                    console.error('Error Status:', error.response.status);
                    console.error('Error Headers:', error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received (request made):', error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Request setup error:', error.message);
                }
            }
        }


    });

    return router
}

