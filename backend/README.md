# AI-Powered Analytics Dashboard: Backend

Node.js + Express + MongoDB REST API. It aggregates sales data with MongoDB pipelines and uses the Claude API to write natural-language summaries.

## Setup

```bash
npm install
cp .env.example .env     # then fill in MONGODB_URI and ANTHROPIC_API_KEY
npm run seed             # loads ~1,400 sample sales records
npm run dev              # http://localhost:5000
```

## Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/api/health` | Health check |
| GET | `/api/analytics/filters` | Available regions and categories |
| GET | `/api/analytics/dashboard` | KPIs plus data for every chart. Query: `from`, `to`, `region`, `category` |
| POST | `/api/analytics/insights` | Aggregates data, sends it to Claude, returns a written summary. Body: `from`, `to`, `region`, `category` |

## Notes

- Only aggregated numbers are sent to Claude, never raw documents.
- The model is configurable with `CLAUDE_MODEL`.
- `/insights` is rate-limited to 10 requests per minute.
- Keep `ANTHROPIC_API_KEY` on the server only. Never expose it to the frontend.
