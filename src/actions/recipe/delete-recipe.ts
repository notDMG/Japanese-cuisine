'use server'

import { auth } from '@/auth/auth'
import { ActionResult } from '@/types/action-result'
import { prisma } from '@/utils/prisma'

export async function deleteRecipe(id: string): Promise<ActionResult> {
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
    return { error: 'You can only delete your own recipes' }
  }

  try {
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: id },
    })

    await prisma.recipe.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    console.error('Deleting recipe error', error)
    return { error: 'Failed to delete recipe' }
  }
}
