import Image from 'next/image'
import Link from 'next/link'
import { getUnitLabel } from '@/constants/selectOptions'
import { DeleteRecipeButton } from './DeleteRecipeButton'

interface FeedRecipeCardProps {
  recipe: {
    id: string
    name: string
    description: string
    imageUrl: string | null
    authorId: string
    author: { name: string | null; email: string } | null
    ingredients: {
      id: string
      quantity: number
      ingredient: { name: string; unit: string }
    }[]
  }
  isOwner: boolean
}

export function FeedRecipeCard({ recipe, isOwner }: FeedRecipeCardProps) {
  return (
    <div className="mx-auto flex h-120 w-full max-w-md min-w-70 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
      <div className="h-48 overflow-hidden p-4 pb-0">
        {recipe.imageUrl ? (
          <div className="group relative h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg">
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
            <span className="text-sm font-semibold text-gray-400">
              No image
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-8 pt-6 text-black">
        <h2 className="truncate text-xl font-bold">{recipe.name}</h2>
      </div>

      {recipe.author && (
        <p className="px-8 pt-1 text-sm text-gray-400">
          by {recipe.author.name ?? recipe.author.email}
        </p>
      )}

      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-8 py-4 text-black">
        <p className="line-clamp-3 shrink-0 text-sm text-gray-600">
          {recipe.description || 'Без описания'}
        </p>

        <div className="flex min-h-0 flex-1 flex-col">
          <h3 className="mb-1 text-sm font-semibold text-gray-700">
            Ingredients:
          </h3>
          <ul className="list-disc space-y-1 overflow-y-auto pr-1 pl-5 text-sm text-gray-600">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>
                {ing.ingredient.name}: {ing.quantity}{' '}
                {getUnitLabel(ing.ingredient.unit)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto flex justify-end gap-2 p-6 pt-0">
        <Link
          href={`/recipes/${recipe.id}`}
          className="rounded-md border border-gray-200 px-4 py-2 text-sm font-bold text-black transition-colors duration-300 hover:bg-gray-50"
        >
          View
        </Link>
        {isOwner && <DeleteRecipeButton recipeId={recipe.id} />}
      </div>
    </div>
  )
}
