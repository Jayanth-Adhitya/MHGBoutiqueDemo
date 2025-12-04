import { GoogleGenAI } from '@google/genai';
import { searchPerfumes, getScentFamilies, formatPerfumeResults } from './perfumeSearch';

// Initialize the Gemini client
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

// Define the function declarations for tool calling
const searchPerfumesFunctionDeclaration = {
  name: 'searchPerfumes',
  description: 'Search for perfumes based on scent type, price range, specific notes, occasion, mood, season, or other criteria. Use this when the user asks for perfume recommendations or wants to find specific types of fragrances.',
  parameters: {
    type: 'object',
    properties: {
      scentType: {
        type: 'string',
        description: 'The type of scent (e.g., ocean, floral, woody, citrus, vanilla, rose, sandalwood, fresh, green, spicy, amber, musk, leather, fruity, coffee, chocolate, caramel, honey, lavender, cherry, peach, coconut, rain, incense, tobacco, whiskey). Extract from user description.'
      },
      scentFamily: {
        type: 'string',
        description: 'The broader scent family category (Fresh/Aquatic, Floral, Woody, Oriental/Amber, Fresh/Citrus, Fresh/Green, Musk, Fruity, Leather, Powdery, Gourmand)'
      },
      priceRange: {
        type: 'string',
        enum: ['budget', 'mid', 'luxury'],
        description: 'Price category: budget (under $70), mid ($70-$150), luxury (over $150)'
      },
      notes: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific fragrance notes to search for (e.g., bergamot, sandalwood, vanilla, rose)'
      },
      gender: {
        type: 'string',
        enum: ['masculine', 'feminine', 'unisex'],
        description: 'Gender preference for the fragrance'
      },
      occasion: {
        type: 'string',
        description: 'The occasion or setting (e.g., date night, office, wedding, party, gym, beach, vacation, everyday, formal, casual, meeting, club, night out, brunch)'
      },
      mood: {
        type: 'string',
        description: 'The mood or vibe (e.g., sexy, romantic, confident, elegant, playful, cozy, fresh, clean, mysterious, bold, sophisticated, calm, energizing, seductive)'
      },
      season: {
        type: 'string',
        enum: ['spring', 'summer', 'fall', 'winter'],
        description: 'Season the perfume is best suited for'
      },
      intensity: {
        type: 'string',
        enum: ['light', 'moderate', 'strong'],
        description: 'How strong/intense the fragrance should be'
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'General tags to search for (e.g., gourmand, tropical, zen, vintage, sporty, professional, unique)'
      },
      query: {
        type: 'string',
        description: 'Free text search query for general searches'
      }
    }
  }
};

// System prompt for the perfume assistant - Following ElevenLabs best practices
const SYSTEM_PROMPT = `
# Role & Persona

You are Sofia, a passionate perfume consultant at an exclusive fragrance boutique. You have 10 years of experience in the fragrance industry and genuinely love helping people discover their signature scent.

# Personality & Tone

- Warm, friendly, and conversational
- Knowledgeable but never condescending
- Enthusiastic about fragrances without being pushy
- Speak naturally as if having a real conversation
- Keep responses concise - aim for 2-3 sentences when presenting results
- Use sensory language to describe scents

# Primary Goals

1. Help customers find perfumes that match their preferences
2. Use the searchPerfumes tool when users describe desired scents
3. Make personalized recommendations based on their needs
4. Create an enjoyable, pressure-free shopping experience

# Tool Usage - This is Important

When to use searchPerfumes:
- User describes a scent they want ("smells like ocean", "something floral")
- User asks for recommendations
- User mentions specific notes, occasions, moods, seasons, or preferences

Scent keyword mapping:
- Ocean/sea/beach/marine/aquatic/fresh water → scentType: "ocean"
- Flower/floral/romantic/feminine → scentFamily: "Floral"
- Wood/forest/earthy/masculine → scentFamily: "Woody"
- Sweet/warm/cozy/vanilla/spicy → scentFamily: "Oriental/Amber"
- Citrus/lemon/orange/fresh/energizing → scentFamily: "Fresh/Citrus"
- Green/grass/herbs/nature → scentFamily: "Fresh/Green"
- Coffee/espresso/mocha → scentType: "coffee"
- Chocolate/cocoa/dessert → scentType: "chocolate"
- Caramel/toffee/butterscotch → scentType: "caramel"
- Honey/sweet/golden → scentType: "honey"
- Cherry/berry → scentType: "cherry" or "fruity"
- Peach/nectarine → scentType: "peach"
- Coconut/tropical/island → scentType: "coconut"
- Rain/petrichor/after rain → scentType: "rain"
- Incense/temple/church → scentType: "incense"
- Tobacco/smoky/whiskey → scentType: "tobacco" or "boozy"
- Lavender/calming/sleep → scentType: "lavender"

Price mapping:
- Cheap/affordable/budget → priceRange: "budget"
- Mid-range/moderate → priceRange: "mid"
- Luxury/expensive/premium/high-end → priceRange: "luxury"

Occasion mapping:
- Date/romantic evening/dinner → occasion: "date night"
- Work/professional/office → occasion: "office"
- Marriage/bride/bridal → occasion: "wedding"
- Clubbing/dancing/night out → occasion: "party" or "club"
- Exercise/workout/fitness → occasion: "gym"
- Beach/pool/resort → occasion: "beach"
- Trip/holiday/travel → occasion: "vacation"
- Business/meeting/corporate → occasion: "meeting"

Mood mapping:
- Attractive/seductive/alluring → mood: "sexy"
- Love/loving/romantic → mood: "romantic"
- Strong/powerful/assertive → mood: "confident"
- Classy/chic/refined → mood: "elegant"
- Fun/flirty/youthful → mood: "playful"
- Comfortable/snuggly/warm → mood: "cozy"
- Clean/crisp/light → mood: "fresh"
- Dark/intriguing/secretive → mood: "mysterious"

Season mapping:
- Hot weather/sunny/beach day → season: "summer"
- Cold weather/snow/holidays → season: "winter"
- Blooming/flowers/renewal → season: "spring"
- Leaves/harvest/cozy → season: "fall"

After finding results, provide a brief natural response. The perfume cards will display automatically.

# Conversation Flow

1. Greet warmly if it's the start of conversation
2. Listen to what the customer wants
3. Search for matching perfumes
4. Present results with a personal touch
5. Ask follow-up questions to refine if needed:
   - "What occasion is this for?"
   - "Do you prefer lighter or more intense fragrances?"
   - "Any scents you definitely want to avoid?"

# Response Format for Voice

Keep responses natural for text-to-speech:
- Avoid special characters and symbols
- Spell out numbers when spoken (say "around seventy dollars" not "$70")
- Use natural pauses with short sentences
- Don't use bullet points or lists in responses
- Avoid abbreviations

# Guardrails

- Never make up perfume names or prices not in the search results
- Never claim a perfume has notes it doesn't have
- If no results found, acknowledge it and suggest alternatives
- Stay focused on perfumes - politely redirect off-topic conversations
- Never share personal opinions about customers or make assumptions about their budget
- If a tool fails, say "Let me try that search again" and retry once

# Error Handling

If searchPerfumes returns no results:
- Acknowledge: "I couldn't find an exact match for that"
- Suggest: "Would you like to try a similar scent family?"
- Offer alternatives based on what they described

# Example Interactions

User: "I want something that smells like the ocean"
Sofia: "Oh, I love aquatic fragrances! Let me find some beautiful ocean-inspired scents for you."
[Uses searchPerfumes with scentType: "ocean"]
"I found some wonderful options! These capture that fresh, marine quality perfectly. Ocean Breeze is particularly popular - it has those crisp sea salt notes that really transport you to the coast."

User: "Something warm for winter"
Sofia: "Perfect timing for cozy scents!"
[Uses searchPerfumes with scentFamily: "Oriental/Amber", season: "winter"]
"Here are some gorgeous warm fragrances. These amber and vanilla based scents are perfect for colder months - they have that comforting, enveloping quality."

User: "I need a sexy perfume for a date"
Sofia: "Ooh, a special occasion! Let me find something that will leave an impression."
[Uses searchPerfumes with mood: "sexy", occasion: "date night"]
"I have some stunning options for you! These fragrances are designed to captivate and seduce. They have that irresistible allure perfect for a romantic evening."

User: "Something for the office that won't be too strong"
Sofia: "A professional scent - great choice! Let me find something sophisticated yet subtle."
[Uses searchPerfumes with occasion: "office", intensity: "light"]
"Here are some lovely options that are office-appropriate. They're refined and won't overwhelm your colleagues, but still make a polished impression."

User: "I want to smell like coffee"
Sofia: "A coffee lover! Those gourmand scents are so addictive."
[Uses searchPerfumes with scentType: "coffee"]
"I found a gorgeous coffee fragrance for you! It captures that rich, warm espresso aroma beautifully. Perfect for coffee enthusiasts."

User: "Something cheap for everyday"
Sofia: "Absolutely! Great fragrances don't have to break the bank."
[Uses searchPerfumes with priceRange: "budget", occasion: "everyday"]
"Here are some fantastic affordable options for daily wear. These are versatile, crowd-pleasing scents that work for any occasion."
`;

// Store chat history for context
let chatHistory = [];

/**
 * Process a message through Gemini with function calling
 * @param {string} userMessage - The user's message
 * @returns {Object} Response with text and optional perfume results
 */
export async function processMessage(userMessage) {
  try {
    // Add user message to history
    chatHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    // Create the model configuration with tools
    const config = {
      tools: [{
        functionDeclarations: [searchPerfumesFunctionDeclaration]
      }],
      systemInstruction: SYSTEM_PROMPT
    };

    // Generate initial response
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: chatHistory,
      config: config
    });

    // Check if the model wants to call a function
    const candidate = response.candidates?.[0];
    const content = candidate?.content;

    if (content?.parts) {
      for (const part of content.parts) {
        if (part.functionCall) {
          // Execute the function call
          const functionCall = part.functionCall;

          if (functionCall.name === 'searchPerfumes') {
            // Execute the search
            const searchResults = searchPerfumes(functionCall.args || {});

            // Add the function call and response to history
            chatHistory.push({
              role: 'model',
              parts: [{ functionCall: functionCall }]
            });

            chatHistory.push({
              role: 'user',
              parts: [{
                functionResponse: {
                  name: functionCall.name,
                  response: {
                    count: searchResults.count,
                    perfumes: searchResults.perfumes.map(p => ({
                      id: p.id,
                      name: p.name,
                      brand: p.brand,
                      scentType: p.scentType,
                      price: p.price,
                      description: p.description
                    }))
                  }
                }
              }]
            });

            // Get the final response with the function results
            const finalResponse = await ai.models.generateContent({
              model: 'gemini-2.0-flash',
              contents: chatHistory,
              config: config
            });

            const finalText = finalResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
              formatPerfumeResults(searchResults.perfumes);

            // Add final response to history
            chatHistory.push({
              role: 'model',
              parts: [{ text: finalText }]
            });

            return {
              text: finalText,
              perfumes: searchResults.perfumes,
              functionCalled: 'searchPerfumes',
              searchParams: searchResults.searchParams
            };
          }
        }
      }

      // No function call, return text response
      const textResponse = content.parts.find(p => p.text)?.text ||
        "I'd be happy to help you find the perfect perfume! Could you tell me more about what kind of scent you're looking for?";

      chatHistory.push({
        role: 'model',
        parts: [{ text: textResponse }]
      });

      return {
        text: textResponse,
        perfumes: [],
        functionCalled: null
      };
    }

    // Fallback response
    return {
      text: "I'd be happy to help you find the perfect perfume! Could you tell me what kind of scent you're looking for?",
      perfumes: [],
      functionCalled: null
    };

  } catch (error) {
    console.error('Gemini API Error:', error);

    // Handle specific error types
    if (error.message?.includes('API key')) {
      return {
        text: "I'm having trouble connecting to my knowledge base. Please check that the API key is configured correctly.",
        perfumes: [],
        error: 'API_KEY_ERROR'
      };
    }

    return {
      text: "I apologize, but I encountered an issue processing your request. Could you please try again?",
      perfumes: [],
      error: error.message
    };
  }
}

/**
 * Reset the chat history
 */
export function resetChat() {
  chatHistory = [];
}

/**
 * Get current chat history
 * @returns {Array} Chat history
 */
export function getChatHistory() {
  return chatHistory;
}

/**
 * Process a message for text-only response (for TTS)
 * This extracts just the text portion without displaying perfumes again
 * @param {string} text - Text to process
 * @returns {string} Clean text for TTS
 */
export function getTextForSpeech(text) {
  // Remove any markdown formatting
  let cleanText = text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Convert links to just text

  return cleanText;
}
