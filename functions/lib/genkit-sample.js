"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuSuggestion = exports.exampleFunction = void 0;
const https_1 = require("firebase-functions/v2/https");
// Genkit models generally depend on an API key. APIs should be stored in Cloud Secret 
// Manager so that access to these sensitive values can be controlled. defineSecret does 
// this for you automatically. Get an API key at https://aistudio.google.com/app/apikey
const params_1 = require("firebase-functions/params");
const apiKey = (0, params_1.defineSecret)("GOOGLE_GENAI_API_KEY");
// The Firebase telemetry plugin exports metrics, traces, and logs to Google Cloud
// Observability. See docs at:
// https://firebase.google.com/docs/genkit/observability/telemetry-collection
const firebase_1 = require("@genkit-ai/firebase");
(0, firebase_1.enableFirebaseTelemetry)();
// Example Cloud Function
exports.exampleFunction = (0, https_1.onRequest)((req, res) => {
    res.json({
        message: "Hello from Firebase Functions!",
        timestamp: new Date().toISOString()
    });
});
exports.menuSuggestion = onCallGenkit({
    // Uncomment to enable AppCheck. This reduces costs by ensuring only Verified app users
    // can use your API. See: https://firebase.google.com/docs/app-check/cloud-functions
    // enforceAppCheck: true,
    // authPolicy can be any callback that accepts an AuthData (a uid and tokens dictionary) and the
    // request data. The isSignedIn() and hasClaim() helpers can be used to simplify. The following
    // will require the user to have the email_verified claim, for example.
    // authPolicy: hasClaim("email_verified"),
    // Grant access to the API key to this function:
    secrets: [apiKey],
}, menuSuggestionFlow);
//# sourceMappingURL=genkit-sample.js.map
