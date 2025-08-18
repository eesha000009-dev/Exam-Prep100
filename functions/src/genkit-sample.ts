import * as functions from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';

// Genkit models generally depend on an API key. APIs should be stored in Cloud Secret 
// Manager so that access to these sensitive values can be controlled. defineSecret does 
// this for you automatically. Get an API key at https://aistudio.google.com/app/apikey
import { defineSecret } from "firebase-functions/params";
const apiKey = defineSecret("GOOGLE_GENAI_API_KEY");

// The Firebase telemetry plugin exports metrics, traces, and logs to Google Cloud
// Observability. See docs at:
// https://firebase.google.com/docs/genkit/observability/telemetry-collection
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
enableFirebaseTelemetry();

// Example Cloud Function
export const exampleFunction = onRequest((req, res) => {
  res.json({
    message: "Hello from Firebase Functions!",
    timestamp: new Date().toISOString()
  });
});

export const menuSuggestion = onCallGenkit({
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
