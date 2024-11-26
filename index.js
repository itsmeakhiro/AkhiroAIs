const axios = require('axios');

const MODELS = {
  PIXTRAL: "Pixtral",
  MISTRAL_NEMO: "Mistral Nemo",
  CODESTRAL_MAMBA: "Codestral Mamba",
  MATHSTRAL: "Mathstral",
  MISTRAL_7B: "Mistral 7B",
  MIXTRAL_8X7B: "Mixtral 8x7B",
  MIXTRAL_8X22B: "Mixtral 8x22B"
};

class Mistral {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("API key is required to initialize Mistral.");
    }
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  }

  async sendMessage(messages, options = {}) {
    try {
      if (!Array.isArray(messages)) {
        throw new Error("Messages must be an array of conversation objects.");
      }

      const model = options.model || MODELS.MISTRAL_7B;

      if (!Object.values(MODELS).includes(model)) {
        throw new Error(`Invalid model. Available models: ${Object.values(MODELS).join(", ")}`);
      }

      const { data } = await axios.post(
        this.apiUrl,
        { model, messages },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          }
        }
      );

      return {
        response: data.choices ? data.choices[0].message.content : data,
        author: 'MistralAI',
      };
    } catch (error) {
      console.error("Error communicating with Mistral API:", error.message);
      return {
        error: "Failed to generate response",
        author: "MistralAI",
      };
    }
  }
}

module.exports = { Mistral, MODELS };