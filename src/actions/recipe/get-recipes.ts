'use server'

import { auth } from '@/auth/auth'
import { Prisma } from '@/generated/prisma'
import { prisma } from '@/utils/prisma'

type GetRecipeResult =
  | {
      success: true
      recipes: Prisma.RecipeGetPayload<{ include: typeof recipeInclude }>[]
    }
  | { error: string }

const recipeInclude = {
  ingredients: {
    include: {
      ingredient: true,
    },
  },
} as const

export async function getRecipes(): Promise<GetRecipeResult> {
  const session = await auth()

  const authorId = session?.user?.id
  if (!authorId) return { error: 'Access denied. Please log in' }

  try {
    const recipes = await prisma.recipe.findMany({
      where: { authorId },
      include: recipeInclude,
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, recipes }
  } catch (error) {
    console.error('Get recipes error:', error)
    return { error: 'Failed to load recipes' }
  }
}
