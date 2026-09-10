export const OPTIONS_CATEGORY = [
  { value: 'VEGETABLES', label: 'Vegetables' },
  { value: 'FRUITS', label: 'Fruits' },
  { value: 'MEAT', label: 'Meat' },
  { value: 'DAIRY', label: 'Dairy' },
  { value: 'SPICES', label: 'Spices' },
  { value: 'OTHER', label: 'Other' },
]

export const UNIT_OPTIONS = [
  { value: 'GRAMS', label: 'Grams' },
  { value: 'KILOGRAMS', label: 'Kilograms' },
  { value: 'MILLILITERS', label: 'Milliliters' },
  { value: 'LITERS', label: 'Liters' },
  { value: 'PIECES', label: 'Pieces' },
]

export function getUnitLabel(unit: string) {
  return (
    UNIT_OPTIONS.find((option) => option.value === unit)?.label ??
    unit.toLowerCase()
  )
}
