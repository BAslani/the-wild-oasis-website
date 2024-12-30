export type CabinType = {
  id: number
  created_at: Date
  name: string
  maxCapacity: number
  regularPrice: number
  discount: number
  description: string
  image: string
}

export type BookingType = {
  id: number
  created_at: Date
  startDate: Date
  endDate: Date
  numNights: number
  numGuests: number
  cabinPrice: number
  extrasPrice: number
  totalPrice: number
  status: string
  hasBreakfast: boolean
  isPaid: boolean
  observations: string
  guests?: {
    fullName: string
    email: string
    country: string
    countryFlag: string
    nationalID: string
  }
  cabins: {
    name: string
    image: string
  }
}

export type GuestType = {
  id: number
  created_at: Date
  fullName: string
  email: string
  nationalID: string
  nationality: string
  countryFlag: string
}

export type SettingsType = {
  minBookingLength: number
  maxBookingLength: number
  maxGuestsPerBooking: number
  breakfastPrice: number
}
