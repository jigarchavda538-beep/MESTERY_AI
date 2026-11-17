# JIGAR AI — Black + Purple Neon

Responsive AI workspace starter for mobile and desktop.

## Included
- Responsive dark glass + purple neon dashboard
- AI chat UI with conversation context
- Optional web search via the Responses API
- Browser speech recognition and text-to-speech (browser support varies)
- Study, coding and document helper screens
- Creative prompt builder (does not generate image files yet)
- PWA manifest and service worker
- Express backend, rate limiting, Helmet security headers
- API key kept on the server in an environment variable

## Requirements
- Node.js 20+
- An API key for the AI provider configured in `server.js` (currently OpenAI)

## Run locally
1. Extract the project.
2. Copy `.env.example` to `.env`.
3. Put your API key in `.env` as `OPENAI_API_KEY=...`.
4. Run `npm install`.
5. Run `npm start`.
6. Open `http://localhost:3000`.

Never commit `.env` or share your API key. Set environment variables in your hosting provider instead.

## Deploy
Deploy as a Node.js web service. Build/install command: `npm install`. Start command: `npm start`. Add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in the host's secret/environment settings. Do not upload `.env`.

## Important limitations
This is a working starter, not a fully production-ready public AI service:
- No real user registration, login, cloud chat storage, billing or admin dashboard.
- Image Studio currently creates a detailed prompt only; it is not connected to an image-generation API.
- Voice depends on browser speech recognition and speech synthesis support.
- Public launch needs a proper privacy policy, authentication if storing accounts, stronger abuse prevention, usage quotas and cost controls.
- AI API usage may incur charges. The site owner should configure a budget and monitor usage before public access.
