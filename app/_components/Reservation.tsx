import React from 'react'
import DateSelector from './DateSelector'
import ReservationForm from './ReservationForm'
import { getBookedDatesByCabinId, getSettings } from '@/app/_lib/data-service'
import { CabinType } from '@/app/_types/types'
import { auth } from '@/app/_lib/auth'
import LoginMessage from './LoginMessage'

type Props = {
  cabin: CabinType
}

export default async function Reservation({ cabin }: Props) {
  const { id } = cabin

  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(id),
  ])

  const session = await auth()
  return (
    <div className='grid grid-cols-2 border border-primary-800 min-h-[400px]'>
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? (
        <ReservationForm user={session.user} cabin={cabin} />
      ) : (
        <LoginMessage />
      )}
    </div>
  )
}
