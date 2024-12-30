'use client'

import { useOptimistic } from 'react'
import { BookingType } from '../_types/types'
import ReservationCard from './ReservationCard'
import { deleteReservation } from '../_lib/actions'

type Props = {
  bookings: BookingType[]
}

export default function ResevationsList({ bookings }: Props) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (currBookings: BookingType[], bookingId: number) => {
      return currBookings.filter((booking) => booking.id !== bookingId)
    }
  )

  async function hendleDelete(bookingId: number) {
    optimisticDelete(bookingId)
    await deleteReservation(bookingId)
  }

  return (
    <ul className='space-y-6'>
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking as unknown as BookingType}
          key={booking.id}
          onDelete={hendleDelete}
        />
      ))}
    </ul>
  )
}
