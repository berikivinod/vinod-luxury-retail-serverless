import OpenAI from "openai";

import type {
  VectorSearchFilters,
} from "./vectorStore";


export class QueryUnderstanding {

  private readonly client: OpenAI;

  private readonly model =
    "gpt-4o-mini";


  constructor() {

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {

      throw new Error(
        "OPENAI_API_KEY environment variable is not configured"
      );
    }


    this.client =
      new OpenAI({
        apiKey,
      });
  }


  async extractFilters(
    query: string
  ): Promise<VectorSearchFilters> {

    console.log(
      "Starting AI query understanding"
    );


    console.log(
      `Query: ${query}`
    );


    /*
     * -----------------------------------------
     * Instructions
     * -----------------------------------------
     */

    const instructions = `
You are a product search query analyzer for VLR,
a luxury fashion retailer.

Your job is to extract ONLY explicit product
search filters from the customer's query.

Supported filters:

1. brand
2. category
3. maxPrice

Rules:

- Extract a brand only when the customer explicitly
  mentions a brand.
- Extract a category only when the customer explicitly
  mentions a product category.
- Extract maxPrice when the customer specifies a
  maximum price, "under", "below", "less than", or
  equivalent wording.
- Do not invent brands.
- Do not invent categories.
- Do not infer a brand from product names.
- Do not infer a category unless it is reasonably
  explicit in the customer's wording.
- If a filter is not present, omit it.
- maxPrice must be a number.
- Return ONLY valid JSON.
- Do not return markdown.
- Do not return explanations.

Allowed category values include:
Handbags, Shoes, Clothing, Jewelry, Accessories,
Beauty, Kids, Home.

Example:

Customer:
Show me Gucci handbags under $2000

Return:
{
  "brand": "Gucci",
  "category": "Handbags",
  "maxPrice": 2000
}

Customer:
I want handbags

Return:
{
  "category": "Handbags"
}

Customer:
Show me products from Gucci

Return:
{
  "brand": "Gucci"
}

Customer:
Show me products under $1000

Return:
{
  "maxPrice": 1000
}

Customer:
Show me premium leather shoes

Return:
{
  "category": "Shoes"
}

Customer:
What do you recommend?

Return:
{}
`;


    /*
     * -----------------------------------------
     * Call OpenAI
     * -----------------------------------------
     */

    const response =
      await this.client.responses.create({

        model:
          this.model,

        instructions,

        input:
          query,

      });


    /*
     * -----------------------------------------
     * Extract model output
     * -----------------------------------------
     */

    const output =
      response.output_text?.trim();


    if (!output) {

      throw new Error(
        "OpenAI did not return query understanding output"
      );
    }


    console.log(
      `Query understanding output: ${output}`
    );


    /*
     * -----------------------------------------
     * Parse JSON
     * -----------------------------------------
     */

    let parsed:
      unknown;


    try {

      parsed =
        JSON.parse(
          output
        );

    } catch (error) {

      console.error(
        "Failed to parse query understanding JSON",
        error
      );


      throw new Error(
        "Query understanding returned invalid JSON"
      );
    }


    /*
     * -----------------------------------------
     * Validate object
     * -----------------------------------------
     */

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {

      throw new Error(
        "Query understanding returned an invalid object"
      );
    }


    const result =
      parsed as Record<string, unknown>;


    /*
     * -----------------------------------------
     * Build validated filters
     * -----------------------------------------
     */

    const filters:
      VectorSearchFilters =
        {};


    /*
     * Brand
     * -----------------------------------------
     */

    if (
      typeof result.brand === "string"
    ) {

      const brand =
        result.brand.trim();


      if (
        brand.length > 0
      ) {

        filters.brand =
          brand;
      }
    }


    /*
     * Category
     * -----------------------------------------
     */

    if (
      typeof result.category === "string"
    ) {

      const category =
        result.category.trim();


      if (
        category.length > 0
      ) {

        filters.category =
          category;
      }
    }


    /*
     * Maximum price
     * -----------------------------------------
     */

    if (
      typeof result.maxPrice === "number"
    ) {

      if (
        Number.isFinite(
          result.maxPrice
        ) &&
        result.maxPrice >= 0
      ) {

        filters.maxPrice =
          result.maxPrice;
      }
    }


    /*
     * -----------------------------------------
     * Final result
     * -----------------------------------------
     */

    console.log(
      "Validated query filters:",
      JSON.stringify(
        filters
      )
    );


    return filters;
  }
}