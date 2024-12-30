'use server'

import { revalidatePath } from 'next/cache'
import { auth, signIn, signOut } from './auth'
import { supabase } from './supabase'
import { getBookings } from './data-service'

const regex = /^[a-zA-Z0-9]{6,12}$/

export async function updateGuest(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('You must be logged in')
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
