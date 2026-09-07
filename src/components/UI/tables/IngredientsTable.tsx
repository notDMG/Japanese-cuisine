'use client'

import { siteConf } from '@/config/site.conf'
import { useAuthStore } from '@/store/use-auth-store'
import { useIngredientStore } from '@/store/use-ingredient-store'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import SignUpButton from '../SignUpButton'

export function IngredientsTable() {
  const { ingredients, removeIngredient, isLoading } = useIngredientStore()
  const { isAuth } = useAuthStore()
  const { status } = useSession()

  const error = useIngredientStore((state) => state.error)

  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 6000, icon: '💢' })
    }
  }, [error])

  if (status === 'loading') {
    return <p className="py-12 text-center text-gray-500">Loading...</p>
  }

  if (status !== 'authenticated') {
    return (
      <div className="flex h-45 flex-col items-center justify-center px-4 text-black">
        <p className="mb-6 text-center text-gray-500">
          Log in to your account to view your ingredients
        </p>
        <SignUpButton />
      </div>
    )
  }

  if (isLoading) {
    return (
      <p className="py-12 text-center text-gray-500">Loading ingredients...</p>
    )
  }

  if (ingredients.length === 0) {
    return (
      <div className="mt-5 min-w-80 rounded-xl border bg-white p-8 text-center shadow-2xl">
        <p className="font-medium text-mist-400">
          The list of ingredients is empty
        </p>
      </div>
    )
  }

  return (
    <div className="mt-5 w-full px-2 md:px-0">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-8 md:hidden">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex flex-col justify-between rounded-2xl bg-white p-2 shadow-xl"
          >
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between gap-3 pb-2">
                <span className="shrink-0 text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.name}
                </span>
                <span className="min-w-0 truncate text-[14px] text-gray-600 uppercase">
                  {ingredient.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 pb-2">
                <span className="shrink-0 text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.category}
                </span>
                <span className="min-w-0 truncate text-[14px] text-gray-600">
                  {ingredient.category}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 pb-2">
                <span className="shrink-0 text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.unit}
                </span>
                <span className="min-w-0 truncate text-[14px] text-gray-600">
                  {ingredient.unit}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 pb-2">
                <span className="shrink-0 text-xs font-semibold text-gray-400 uppercase">
                  {siteConf.tableContent.pricePerUnit}
                </span>
                <span className="text-[16px] font-bold text-gray-950 italic">
                  {ingredient.pricePerUnit ? (
                    `${ingredient.pricePerUnit} $`
                  ) : (
                    <span className="text-[14px] font-normal text-gray-500 not-italic">
                      Price not listed
                    </span>
                  )}
                </span>
              </div>
            </div>

            {isAuth && (
              <button
                onClick={() => removeIngredient(ingredient.id)}
                disabled={isLoading}
                className="flex h-10 w-full items-center justify-center rounded-xl border border-red-300 px-4 font-bold text-red-600 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="hidden min-w-full overflow-x-auto rounded-2xl bg-white text-center shadow-xl md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="border-b border-orange-400 bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 font-bold text-black lg:px-6"
              >
                {siteConf.tableContent.name}
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-bold text-black lg:px-6"
              >
                {siteConf.tableContent.category}
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-bold text-black lg:px-6"
              >
                {siteConf.tableContent.unit}
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-bold text-black lg:px-6"
              >
                {siteConf.tableContent.pricePerUnit}
              </th>
              <th
                scope="col"
                className="px-4 py-3 font-bold text-black lg:px-6"
              >
                {siteConf.tableContent.action}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {ingredients.toReversed().map((ingredient) => (
              <tr
                key={ingredient.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-4 py-4 whitespace-nowrap text-gray-500 uppercase lg:px-6">
                  {ingredient.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-500 lg:px-6">
                  {ingredient.category}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-500 lg:px-6">
                  {ingredient.unit}
                </td>
                <td className="px-4 py-4 font-semibold whitespace-nowrap text-gray-900 italic lg:px-6">
                  {ingredient.pricePerUnit ? (
                    `${ingredient.pricePerUnit} $`
                  ) : (
                    <p className="text-[14px] text-gray-500">
                      Price not listed
                    </p>
                  )}
                </td>
                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap lg:px-6">
                  {isAuth && (
                    <button
                      onClick={() => removeIngredient(ingredient.id)}
                      disabled={isLoading}
                      className="rounded-xl px-4 py-2 font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
