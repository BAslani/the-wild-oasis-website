import { eachDayOfInterval } from 'date-fns'
import { supabase } from './supabase'
import { BookingType, CabinType, GuestType } from '../_types/types'
import { notFound } from 'next/navigation'

// GET

export async function getCabin(id: number) {
  const { data, error } = await supabase
    .from('cabins')
    .select('*')
    .eq('id', id)
    .single()

  // For testing
  // await new Promise((res) => setTimeout(res, 1000));

  if (error) {
    console.error(error)
    notFound()
  }

  return data as CabinType
}

export async function getCabinPrice(id: number) {
  const { data, error } = await supabase
    .from('cabins')
    .select('regularPrice, discount')
    .eq('id', id)
    .single()

  if (error) {
    console.error(error)
  }

  return data as { regularPrice: number; discount: number }
}

export const getCabins = async function () {
  const { data, error } = await supabase
    .from('cabins')
    .select('id, name, maxCapacity, regularPrice, discount, image')
    .order('name')

  if (error) {
    console.error(error)
    throw new Error('Cabins could not be loaded')
  }

  return data as CabinType[]
}

// Guests are uniquely identified by their email address
export async function getGuest(email: string) {
  const { data } = await supabase
    .from('guests')
    .select('*')
    .eq('email', email)
    .single()

  // No error here! We handle the possibility of no guest in the sign in callback
  return data as GuestType
}

export async function getBooking(id: number) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(error)
    throw new Error('Booking could not get loaded')
  }

  return data as BookingType
}

export async function getBookings(guestId: number) {
  const { data, error } = await supabase
    .from('bookings')
    // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
    .select(
      'id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)'
    )
    .eq('guestId', guestId)
    .order('startDate')

  if (error) {
    console.error(error)
    throw new Error('Bookings could not get loaded')
  }

  return data
}

export async function getBookedDatesByCabinId(cabinId: number) {
  let today: Date | string
  today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  today = today.toISOString()

  // Getting all bookings
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('cabinId', cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`)

  if (error) {
    console.error(error)
    throw new Error('Bookings could not get loaded')
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      })
    })
    .flat()

  return bookedDates
}

export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*').single()

  if (error) {
    console.error(error)
    throw new Error('Settings could not be loaded')
  }

  return data
}

export async function getCountries() {
  try {
    const res = await fetch('https://restcountries.com/v2/all?fields=name,flag')
    const countries = await res.json()
    return countries
  } catch {
    throw new Error('Could not fetch countries')
  }
}

export async function createGuest(newGuest: Partial<GuestType>) {
  const { data, error } = await supabase.from('guests').insert([newGuest])

  if (error) {
    console.error(error)
    throw new Error('Guest could not be created')
  }

  return data
}
