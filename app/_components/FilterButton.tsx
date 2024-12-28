import React, { ReactNode } from 'react'

type Props = {
  filter: 'all' | 'small' | 'medium' | 'large'
  handleFilter: (filter: string) => void
  activeFilter: string
  children: ReactNode
}

export default function FilterButton({
  filter,
  handleFilter,
  activeFilter,
  children,
}: Props) {
  return (
    <button
      onClick={() => handleFilter(filter)}
      className={`px-5 py-2 hover:bg-primary-700 ${
        filter === activeFilter && 'bg-primary-700 text-primary-50'
      }`}
    >
      {children}
    </button>
  )
}
