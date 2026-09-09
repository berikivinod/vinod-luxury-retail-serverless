import OpenAI from "openai";

import type {
  EmbeddingProvider,
} from "./embeddingProvider";

export class OpenAIEmbeddingProvider
  implements EmbeddingProvider {

  private readonly client: OpenAI;

  private readonly model =
    "text-embedding-3-small";

  constructor() {

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY environment variable is not configured"
      );
    }

    this.client = new OpenAI({
      apiKey,
    });
  }

  async createEmbedding(
    text: string
  ): Promise<number[]> {

    if (!text.trim()) {
      throw new Error(
        "Cannot create embedding from empty text"
      );
    }

    const response =
      await this.client.embeddings.create({
        model: this.model,

        input: text,
      });

    const embedding =
      response.data[0]?.embedding;

    if (!embedding) {
      throw new Error(
        "OpenAI returned no embedding"
      );
    }

    return embedding;
  }
}