const Anthropic = require('@anthropic-ai/sdk');

let client;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    const err = new Error('ANTHROPIC_API_KEY is not set on the server.');
    err.status = 500;
    throw err;
  }
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

const SYSTEM_PROMPT = `You are a senior business analyst writing for a non-technical reader.
You are given aggregated sales analytics as JSON. Write a clear natural-language summary.
Rules:
- Use only the numbers in the data. Never invent figures.
- Mention trends (growth or decline month over month), the strongest and weakest segments, and one risk or anomaly if the data shows it.
- Keep the whole answer under 180 words.
- Format: a one-sentence headline, then 3-4 short bullet points starting with "- ", then one line starting with "Recommendation:".
- Amounts are in US dollars.`;

/**
 * Turn aggregated dashboard data into a plain-English summary using Claude.
 * Only aggregates are sent to the API, never raw documents.
 */
async function generateInsights(data, filters = {}) {
  const anthropic = getClient();

  const userContent =
    `Filters applied: ${JSON.stringify(filters)}\n\n` +
    `Aggregated data:\n${JSON.stringify(data, null, 2)}`;

  const response = await anthropic.messages.create({
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-5-5',
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userContent }],
  });

  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();
}

module.exports = { generateInsights };
