const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEFAULT_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callOpenAI(messages, options = {}) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const endpoint = options.endpoint || process.env.OPENAI_API_ENDPOINT || DEFAULT_ENDPOINT;
  const model = options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const maxTokens = options.maxTokens || 500;
  const temperature = options.temperature || 0.7;

  let lastError;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response format');
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      lastError = error;

      if (attempt < MAX_RETRIES - 1) {
        const delay = RETRY_DELAY * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw new Error(`Failed after ${MAX_RETRIES} retries: ${lastError.message}`);
}

module.exports = {
  callOpenAI,
  OPENAI_API_KEY
};