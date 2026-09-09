import { openai } from "../client";

import type {
    EmbeddingProvider,
} from "./embeddingProvider";


export class OpenAIEmbeddingProvider
    implements EmbeddingProvider {

    async createEmbedding(
        text: string
    ): Promise<number[]> {

        const response =
            await openai.embeddings.create({

                model:
                    process.env.OPENAI_EMBEDDING_MODEL ||
                    "text-embedding-3-small",

                input:
                    text,

            });


        const embedding =
            response.data[0]?.embedding;


        if (!embedding) {

            throw new Error(
                "OpenAI embedding response did not contain an embedding."
            );

        }


        return embedding;

    }

}