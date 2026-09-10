'use client'

import { useRecipeStore } from '@/store/use-recipe-store'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
  const removeRecipe = useRecipeStore((s) => s.removeRecipe)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      await removeRecipe(recipeId)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="h-10 items-center justify-center rounded-xl border border-red-300 px-4 font-bold text-red-600 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
