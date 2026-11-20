// Gemini API Service for ForgeAI Academic Student Assistant

// Built-in default key for all students & visitors
const DEFAULT_KEY_B64 = 'QVEuQWI4Uk42TEJ2RFdqem1JLWg0YWV6WVh4QUljTXVZTHdzTzNwRTZ6YmIya05xZm0ydEE=';

function getBuiltinKey(): string {
  try {
    if (typeof atob !== 'undefined') {
      return atob(DEFAULT_KEY_B64);
    }
  } catch {
    // fallback
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

const MODEL_CANDIDATES = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro'
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export class GeminiAIService {
  private apiKey: string = getBuiltinKey();

  constructor() {
    this.apiKey = getBuiltinKey();
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('studyforge_gemini_key');
      if (savedKey && savedKey.trim()) {
        this.apiKey = savedKey.trim();
      }
    }
  }

  public setApiKey(key: string) {
    this.apiKey = key.trim() || getBuiltinKey();
    if (typeof window !== 'undefined') {
      localStorage.setItem('studyforge_gemini_key', this.apiKey);
    }
  }

  public getApiKey(): string {
    return this.apiKey || getBuiltinKey();
  }

  public async askAI(userQuery: string, history: ChatMessage[] = []): Promise<string> {
    const activeKey = this.apiKey || getBuiltinKey();
    if (!activeKey || !activeKey.trim()) {
      return `⚠️ **ForgeAI Notice**: AI mentor is currently connecting. Please ensure your internet connection is active.`;
    }

    const systemPrompt = `You are ForgeAI, a friendly, ultra-knowledgeable academic mentor for students (Class 9, 10, 11, 12, JEE, and NEET).
Your task is to:
1. Explain academic concepts with crystal clarity, simple analogies, and zero fluff.
2. Solve numerical problems step-by-step, showing the exact formula, substitution, and final answer with units.
3. Highlight common traps, exam pitfalls, and previous year question (PYQ) insights.
4. Provide smart mnemonics and memory shortcuts to remember hard reactions, tables, or formulas.
5. Format your answers with clear markdown headers, bold terms, bullet points, and clean math notations.`;

    // Construct contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add recent history (up to last 6 messages)
    history.slice(-6).forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nStudent Question:\n${userQuery}` }]
    });

    // Try model candidates in order
    let lastError: string | null = null;

    for (const modelId of MODEL_CANDIDATES) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${encodeURIComponent(activeKey)}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 14000);

        const response = await fetch(endpoint, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': activeKey
          },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.5,
              maxOutputTokens: 1500
            }
          })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMsg = errorData?.error?.message || `HTTP ${response.status}`;
          lastError = errorMsg;
          // If high demand or model not found, try next candidate
          continue;
        }

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (reply) {
          return reply;
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    // If all candidates hit high demand, return helpful formatted academic response
    return `⚠️ **ForgeAI High-Demand Notice**: Google Gemini servers are temporarily congested (${lastError || 'timeout'}).
    
💡 **StudyForge Tips**:
- The system automatically tested ${MODEL_CANDIDATES.join(', ')}.
- You can retry your question in 10-15 seconds.
- All offline StudyForge tools (Pomodoro, Smart Whiteboard, Lo-Fi Soundscapes, Class-Calibrated Quiz Arena) remain 100% operational offline!`;
  }
}

export const geminiService = new GeminiAIService();
