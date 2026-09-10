'use server'

import { auth } from '@/auth/auth'
import { recipeSchema } from '@/schema/recipe'
import { RecipeActionResult } from '@/types/recipe'
import { prisma } from '@/utils/prisma'

export async function updateRecipe(
  id: string,
  formData: unknown
): Promise<RecipeActionResult> {
  const session = await auth()

  const authorId = session?.user?.id
  if (!authorId) {
    return { error: 'Access denied. Please log in' }
  }

  if (!id) {
    return { error: 'Invalid recipe ID' }
  }

  const existing = await prisma.recipe.findUnique({ where: { id } })
  if (!existing) return { error: 'Recipe not found' }
  if (existing.authorId !== authorId) {
    return { error: 'You can only edit your only recipe' }
  }

  const parsed = recipeSchema.safeParse(formData)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Invalid input data'
    return { error: firstError }
  }

  try {
    const { name, description, imageUrl, ingredients } = parsed.data

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
        ingredients: {
          deleteMany: {},
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredient: { connect: { id: ingredientId } },
            quantity,
          })),
        },
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
    console.error('Updating recipe error:', error)
    return { error: 'Failed to update recipe' }
  }
}
