'use server'

import { auth } from '@/auth/auth'
import { recipeSchema } from '@/schema/recipe'
import { RecipeActionResult } from '@/types/recipe'
import { prisma } from '@/utils/prisma'

export async function createRecipe(
  formData: unknown
): Promise<RecipeActionResult> {
  const session = await auth()

  const authorId = session?.user?.id
  if (!authorId) return { error: 'Access denied. Please log in' }

  const parsed = recipeSchema.safeParse(formData)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message
    return { error: firstError }
  }

  try {
    const { name, description, imageUrl, ingredients } = parsed.data

    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        imageUrl: imageUrl || null,
        ingredients: {
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredientId,
            quantity,
          })),
        },
        authorId,
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    })

    return { success: true, recipe }
  } catch (error) {
    console.error('Recipe creating error:', error)
    return { error: 'Failed to create recipe' }
  }
}
