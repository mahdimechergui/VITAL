// Groq API Client for AI-powered features
// Documentation: https://console.groq.com/docs/speech-text

const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqCompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

/**
 * Initialize Groq API client
 */
export class GroqClient {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = 'mixtral-8x7b-32768') {
    this.apiKey = apiKey || process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
    this.model = model;

    if (!this.apiKey) {
      console.error('Missing Groq API key');
    }
  }

  /**
   * Send a message to Groq and get AI response
   */
  async chat(messages: GroqMessage[], options?: GroqCompletionOptions) {
    try {
      const response = await fetch(GROQ_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options?.model || this.model,
          messages,
          temperature: options?.temperature || 0.7,
          max_tokens: options?.max_tokens || 1024,
          top_p: options?.top_p || 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.choices?.[0]?.message?.content || '',
        data,
      };
    } catch (error) {
      console.error('Groq API error:', error);
      return {
        success: false,
        message: '',
        error,
      };
    }
  }

  /**
   * Generate event recommendations based on member interests
   */
  async generateEventRecommendations(
    memberInterests: string[],
    upcomingEvents: string[]
  ) {
    const prompt = `Based on the following member interests: ${memberInterests.join(', ')}, 
    and considering these upcoming events: ${upcomingEvents.join(', ')},
    suggest 3-5 relevant events or activities that would engage the member. 
    Format as a JSON array with event names and brief descriptions.`;

    return this.chat([
      {
        role: 'system',
        content: 'You are a helpful AI assistant for club management. Provide recommendations in JSON format.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  }

  /**
   * Generate automated notification/message for members
   */
  async generateMemberNotification(
    recipientName: string,
    eventName: string,
    eventDetails: string
  ) {
    const prompt = `Generate a friendly and engaging notification message for ${recipientName} about the upcoming event "${eventName}". 
    Event details: ${eventDetails}. 
    Keep it concise (under 150 words) and action-oriented.`;

    return this.chat([
      {
        role: 'system',
        content: 'You are a helpful AI assistant for club communications. Write engaging, personalized messages.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  }

  /**
   * Analyze sentiment from member feedback
   */
  async analyzeSentiment(feedback: string) {
    const prompt = `Analyze the sentiment of the following feedback and provide:
    1. Overall sentiment (positive/neutral/negative)
    2. Key topics mentioned
    3. Action items if any
    
    Feedback: "${feedback}"
    
    Format as JSON with keys: sentiment, topics, actionItems`;

    return this.chat([
      {
        role: 'system',
        content: 'You are a sentiment analysis expert. Provide structured analysis in JSON format.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  }

  /**
   * Generate event agenda/schedule suggestions
   */
  async generateEventAgenda(eventType: string, duration: number, attendees: number) {
    const prompt = `Create a detailed agenda for a ${eventType} event lasting ${duration} hours with approximately ${attendees} attendees. 
    Include timing, activities, breaks, and transition points. Format as a structured timeline.`;

    return this.chat([
      {
        role: 'system',
        content: 'You are an expert event planner. Provide detailed, practical event agendas.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);
  }

  /**
   * General purpose AI chat for club operations
   */
  async chat_general(userMessage: string, systemContext: string = '') {
    return this.chat([
      {
        role: 'system',
        content: systemContext || 'You are a helpful AI assistant for club management.',
      },
      {
        role: 'user',
        content: userMessage,
      },
    ]);
  }
}

// Create and export singleton instance
export const groqClient = new GroqClient(process.env.EXPO_PUBLIC_GROQ_API_KEY);

export default groqClient;
