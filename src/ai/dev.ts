import { config } from 'dotenv';
config();

// Import flows to register them with Genkit for dev/watch mode
import './flows/describe-app-flow';
import './flows/macro-audio-report-flow';
import './flows/sentiment-flow';
import './flows/synthesize-ticker-flow';
import './flows/ticker-insights-flow';

