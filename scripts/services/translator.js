const { callOpenAI, OPENAI_API_KEY } = require('./openai');

const TRANSLATION_PROMPT = `You are a professional translator. Translate the following text to Chinese (Simplified). 
- Keep the translation natural, fluent, and professional
- Preserve the original meaning and tone
- Only output the translated text, no explanations

Text to translate:`;

async function translateToChinese(text) {
  if (!text || text.trim().length === 0) {
    return text;
  }

  if (!OPENAI_API_KEY) {
    return text;
  }

  try {
    const messages = [
      { role: 'system', content: TRANSLATION_PROMPT },
      { role: 'user', content: text }
    ];

    const translated = await callOpenAI(messages, {
      maxTokens: 1000,
      temperature: 0.3
    });

    return translated;
  } catch (error) {
    console.error('Translation failed:', error.message);
    return text;
  }
}

module.exports = {
  translateToChinese
};