'use client'

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  use,
  useState,
} from 'react'
import { DateRange } from 'react-day-picker'

const initialState = {
  from: undefined,
  to: undefined,
}

const ReservationContext = createContext({})

function ReservationProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DateRange | undefined>(initialState)
  const resetRange = () => {
    setRange(initialState)
  }
  return (
    <ReservationContext.Provider
      value={{
        range,
        setRange,
        resetRange,
      }}
    >
      {children}
    </ReservationContext.Provider>
  )
}

function useReservation() {
  const context = use(ReservationContext)
  if (context === undefined) {
    throw new Error('Context was used outside the provider')
  }
  return context as {
    range: DateRange
    setRange: Dispatch<SetStateAction<DateRange | undefined>>
    resetRange: () => void
  }
}

export { ReservationProvider, useReservation }
