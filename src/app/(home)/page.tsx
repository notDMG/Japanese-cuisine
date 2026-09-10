import { auth } from '@/auth/auth'
import { FeedRecipeCard } from '@/components/UI/common/FeedRecipeCard'
import { prisma } from '@/utils/prisma'

export default async function HomePage() {
  const session = await auth()
  const userId = session?.user?.id

  const recipes = await prisma.recipe.findMany({
    include: {
      author: { select: { name: true, email: true } },
      ingredients: { include: { ingredient: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  return (
    <main className="mx-auto max-w-6xl px-4">
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <FeedRecipeCard
            key={recipe.id}
            recipe={recipe}
            isOwner={userId === recipe.authorId}
          />
        ))}
      </section>
    </main>
  )
}
