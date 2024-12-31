'use server'

import { revalidatePath } from 'next/cache'
import { auth, signIn, signOut } from './auth'
import { supabase } from './supabase'
import { getBookings } from './data-service'
import { redirect } from 'next/navigation'
import { BookingExtraData } from '../_components/ReservationForm'

const regex = /^[a-zA-Z0-9]{6,12}$/

export async function updateGuest(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('You must be logged in')
  const nationalID = formData.get('nationalID')
  const [nationality, countryFlag] = (
    formData.get('nationality') as string
  )?.split('%')

  if (!regex.test(nationalID as string))
    throw new Error('Please provide a valid ID')

  const updateData = {
    nationality,
    countryFlag,
    nationalID,
  }

  const { error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId)

  if (error) {
    throw new Error('Guest could not be updated')
  }

  revalidatePath('/account/profile')
}

export async function createBooking(
  bookingData: BookingExtraData,
  formData: FormData
) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in')

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations')?.slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    status: 'unconfirmed',
    hasBreakfast: false,
    isPaid: false,
  }

  const { error } = await supabase.from('bookings').insert([newBooking])

  if (error) {
    console.error(error)
    throw new Error('Booking could not be created')
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`)
  redirect('/cabins/thankyou')
}

export async function updateReservation(formData: FormData) {
  const bookingId = Number(formData.get('bookingId'))
  const session = await auth()
  if (!session) throw new Error('You must be logged in')

  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingIds = guestBookings.map((booking) => booking.id)

  if (!guestBookingIds.includes(bookingId))
    throw new Error('Not authorized action')

  const numGuests = Number(formData.get('numGuests'))
  const observations = formData.get('observations')

  const updateData = {
    numGuests,
    observations: observations?.slice(0, 1000),
  }

  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)

  if (error) throw new Error('Booking could not be updated')

  revalidatePath('/account/reservations')
  revalidatePath(`/account/reservations/edit/${bookingId}`)
  redirect('/account/reservations')
}

export async function deleteReservation(bookingId: number) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in')

  const guestBookings = await getBookings(session.user.guestId)
  const guestBookingIds = guestBookings.map((booking) => booking.id)

  if (!guestBookingIds.includes(bookingId))
    throw new Error('Not authorized action')

  const { error } = await supabase.from('bookings').delete().eq('id', bookingId)

  if (error) {
    console.error(error)
    throw new Error('Booking could not be deleted')
  }

  revalidatePath('/account/reservations')
}

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' })
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' })
}
