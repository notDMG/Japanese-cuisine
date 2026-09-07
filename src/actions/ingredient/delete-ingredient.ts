'use server'

import { auth } from '@/auth/auth'
import { ActionIngredientResult } from '@/types/action-result'
import { prisma } from '@/utils/prisma'

export async function deleteIngredient(
  id: string
): Promise<ActionIngredientResult> {
  const session = await auth()

  if (!session?.user) {
    return { error: 'Access denied. Please log in.' }
  }

  if (!id) {
    return { error: 'Invalid ingredient ID' }
  }

  try {
    const usages = await prisma.recipeIngredient.findMany({
      where: { ingredientId: id },
      select: {
        recipe: {
          select: {
            name: true,
          },
        },
      },
    })

    if (usages.length > 0) {
      const recipeNames = [
        ...new Set(usages.map((usages) => usages.recipe.name)),
      ].join(', ')

      return {
        error: `Cannot delete. This ingredient is used in the following recipes: ${recipeNames}`,
      }
    }

    const ingredient = await prisma.ingredient.delete({
      where: { id },
    })

    return { success: true, ingredient }
  } catch (error) {
    console.error('Error deleting ingredient:', error)
    return { error: 'Something went wrong while deleting the ingredient' }
  }
}
