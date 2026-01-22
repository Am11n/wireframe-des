import { useState } from 'react'
import type { BookingState, BookingSteg, KalenderSlot } from '../../../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

const steps: BookingSteg[] = ['velg-tid', 'detaljer', 'logg-inn', 'bekreft', 'ferdig']

export function useBookingState() {
  const [currentStep, setCurrentStep] = useState<BookingSteg>('velg-tid')
  const [selectedSlots, setSelectedSlots] = useState<KalenderSlot[]>([])
  const [selectedAddOnServices, setSelectedAddOnServices] = useState<string[]>([])
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: ''
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [guestBooking, setGuestBooking] = useState(false)

  const goToNextStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const goToPreviousStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const goToStep = (step: BookingSteg) => {
    setCurrentStep(step)
  }

  const reset = () => {
    setCurrentStep('velg-tid')
    setSelectedSlots([])
    setSelectedAddOnServices([])
    setBookingDetails({
      name: '',
      email: '',
      phone: '',
      organization: '',
      message: ''
    })
    setIsLoggedIn(false)
    setGuestBooking(false)
  }

  return {
    currentStep,
    selectedSlots,
    selectedAddOnServices,
    bookingDetails,
    isLoggedIn,
    guestBooking,
    setCurrentStep,
    setSelectedSlots,
    setSelectedAddOnServices,
    setBookingDetails,
    setIsLoggedIn,
    setGuestBooking,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    reset
  }
}
