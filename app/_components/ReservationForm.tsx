'use client'

import { CabinType } from '@/app/_types/types'
import { User } from 'next-auth'
import { useReservation } from './ReservationContext'
import { differenceInDays, isSameDay } from 'date-fns'
import { createBooking } from '../_lib/actions'
import SubmitButton from './SubmitButton'

type Props = {
  cabin: CabinType
  user: User
}

export type BookingExtraData = {
  startDate: Date
  endDate: Date
  numNights: number
  cabinPrice: number
  cabinId: number
}

function ReservationForm({ cabin, user }: Props) {
  const { range, resetRange } = useReservation()
  const { maxCapacity, regularPrice, discount, id: cabinId } = cabin
  const startDate = range.from || new Date(0)
  const endDate = range.to || new Date(0)

  const numNights = differenceInDays(endDate, startDate)
  const cabinPrice = numNights * (regularPrice - discount)

  const newBookingData: BookingExtraData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId,
  }

  const createBookingWithData = createBooking.bind(null, newBookingData)

  return (
    <div className='scale-[1.01]'>
      <div className='bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center'>
        <p>Logged in as </p>

        <div className='flex gap-4 items-center'>
          {user.name && user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              referrerPolicy='no-referrer'
              className='h-8 rounded-full'
              src={user.image}
              alt={user.name}
            />
          )}
          <p>{user.name}</p>
        </div>
      </div>
      <form
        action={async (formData) => {
          await createBookingWithData(formData)
          resetRange()
        }}
        className='bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col h-full'
      >
        <div className='space-y-2'>
          <label htmlFor='numGuests'>How many guests?</label>
          <select
            name='numGuests'
            id='numGuests'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            required
          >
            <option value='' key=''>
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <textarea
            name='observations'
            id='observations'
            className='px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm'
            placeholder='Any pets, allergies, special requirements, etc.?'
          />
        </div>

        <div className='flex justify-end items-center gap-6'>
          {isSameDay(endDate, new Date(0)) ? (
            <p className='text-primary-300 text-base'>
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton title='Reserve now' pendigLabel='Reserving...' />
          )}
        </div>
      </form>
    </div>
  )
}

export default ReservationForm
