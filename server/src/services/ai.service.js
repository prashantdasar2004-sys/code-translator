import { getPromptByType, SYSTEM_PROMPT } from '../utils/prompt.js';
import { SUPPORTED_LANGUAGES, REQUEST_TYPES } from '../constants/prompt.js';

const MODEL = 'openrouter/auto';

async function callOpenRouter(systemPrompt, userPrompt) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
      'X-Title': 'AI Code Assistant',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenRouter error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

class AIService {
  async processCodeRequest(code, language, requestType, additionalContext = '') {
    try {
      if (!code || !language || !requestType) {
        throw new Error('Missing required parameters: code, language, or requestType');
      }
      if (!SUPPORTED_LANGUAGES[language.toUpperCase()]) {
        throw new Error(`Unsupported language: ${language}`);
      }
      if (!REQUEST_TYPES[requestType.toUpperCase()]) {
        throw new Error(`Unsupported request type: ${requestType}`);
      }

      const prompt = getPromptByType(requestType, code, language, additionalContext);
      const text   = await callOpenRouter(SYSTEM_PROMPT, prompt);

      return {
        success:  true,
        response: text,
        metadata: { language, requestType, timestamp: new Date(), model: MODEL },
      };
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return {
        success: false,
        error:   error.message,
        metadata: { language, requestType, timestamp: new Date() },
      };
    }
  }

  async debugCode(code, language, error)           { return this.processCodeRequest(code, language, 'debug',    error);   }
  async explainCode(code, language)                { return this.processCodeRequest(code, language, 'explain');           }
  async optimizeCode(code, language)               { return this.processCodeRequest(code, language, 'optimize');          }
  async reviewCode(code, language)                 { return this.processCodeRequest(code, language, 'review');            }
  async generateTests(code, language)              { return this.processCodeRequest(code, language, 'test');              }
  async analyzeExecution(code, language, request)  { return this.processCodeRequest(code, language, 'execute',  request); }
  async generateDocumentation(code, language)      { return this.processCodeRequest(code, language, 'document');          }
  async refactorCode(code, language)               { return this.processCodeRequest(code, language, 'refactor');          }
}

export default new AIService();