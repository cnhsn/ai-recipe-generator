import axios from 'axios';

export interface RecipeRequest {
  ingredients?: string[];
  cuisine?: string;
  dietary?: string;
  mealType?: string;
}

export async function generateRecipe(params: RecipeRequest) {
  try {
    const response = await axios.post(
      process.env.OPENROUTER_URL!,
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a professional chef who creates detailed recipes based on given ingredients and preferences."
          },
          {
            role: "user",
            content: `Create a recipe with these details:
              ${params.ingredients ? `Ingredients: ${params.ingredients.join(', ')}` : ''}
              ${params.cuisine ? `Cuisine Type: ${params.cuisine}` : ''}
              ${params.dietary ? `Dietary Requirements: ${params.dietary}` : ''}
              ${params.mealType ? `Meal Type: ${params.mealType}` : ''}
              Please provide the recipe with title, ingredients list, step-by-step instructions, and cooking time.`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
} 