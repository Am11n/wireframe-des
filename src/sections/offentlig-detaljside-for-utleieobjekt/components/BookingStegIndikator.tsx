import { Check } from 'lucide-react'
import type { BookingStegIndikatorProps } from '../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function BookingStegIndikator({
  currentStep,
  steps
}: BookingStegIndikatorProps) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = index < currentStepIndex
        const isUpcoming = index > currentStepIndex

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isActive
                    ? 'bg-stone-900 dark:bg-stone-100 border-stone-900 dark:border-stone-100 text-white dark:text-stone-900'
                    : isCompleted
                    ? 'bg-green-600 dark:bg-green-500 border-green-600 dark:border-green-500 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-600 text-stone-400 dark:text-stone-500'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center">
                <div
                  className={`text-xs font-medium ${
                    isActive
                      ? 'text-stone-900 dark:text-stone-100'
                      : isCompleted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-stone-400 dark:text-stone-500'
                  }`}
                >
                  {step.label}
                </div>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  isCompleted
                    ? 'bg-green-600 dark:bg-green-500'
                    : 'bg-stone-200 dark:bg-stone-700'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}