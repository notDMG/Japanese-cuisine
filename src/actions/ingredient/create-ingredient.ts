'use server'

import { auth } from '@/auth/auth'
import { ingredientSchema } from '@/schema/ingredient'
import { ActionIngredientResult } from '@/types/action-result'
import { prisma } from '@/utils/prisma'

export async function createIngredient(
  formData: unknown
): Promise<ActionIngredientResult> {
  const session = await auth()

  const authorId = session?.user?.id
  if (!authorId) return { error: 'Access denied. Please log in' }

  const parsed = ingredientSchema.safeParse(formData)

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Invalid input data'
    return { error: firstError }
  }

  try {
    const ingredient = await prisma.ingredient.create({
      data: { ...parsed.data, authorId },
    })

    return { success: true, ingredient }
  } catch (error) {
    console.error('Error creating ingredient', error)
    return { error: 'Failed to save the ingredient' }
  }
}
