'use server'

import { auth } from '@/auth/auth'
import { Ingredient } from '@/generated/prisma'
import { prisma } from '@/utils/prisma'

type GetIngredientResult =
  { success: true; ingredients: Ingredient[] } | { error: string }

export async function getIngredients(): Promise<GetIngredientResult> {
  const session = await auth()

  const authorId = session?.user?.id
  if (!authorId) return { error: 'Access denied. Please log in' }

  try {
    const ingredients = await prisma.ingredient.findMany({
      where: { authorId },
    })
    return { success: true, ingredients }
  } catch (error) {
    console.error('Error retrieving ingredients', error)
    return { error: 'Error retrieving ingredients' }
  }
}
