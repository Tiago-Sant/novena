'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { parseISO, differenceInDays, addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNovenaStore } from '../store/useNovenaStore'
import { novenas } from '../data'

interface NovenaNavigationProps {
  novenaId: string
  currentDay?: number
  selectedDay?: number
  onDaySelect?: (day: number) => void
}

export default function NovenaNavigation({ novenaId, currentDay, selectedDay, onDaySelect }: NovenaNavigationProps) {
  const router = useRouter()
  const { getNovena, markDay } = useNovenaStore()

  const novenaInstance = getNovena(novenaId)
  if (!novenaInstance) return null

  const novenaData = novenas[novenaInstance.type as keyof typeof novenas]
  if (!novenaData) return null

  const startDateObj = parseISO(novenaInstance.startDate)
  const currentDateDiff = differenceInDays(new Date(), startDateObj)
  const currentDayOfNovena = Math.max(0, Math.min(8, currentDateDiff)) + 1

  const handleDayClick = (day: number) => {
    if (onDaySelect) {
      onDaySelect(day)
    } else {
      // Se não há callback personalizado, navega para a página da novena
      router.push(`/novena/${novenaId}`)
    }
  }

  const getDayStatus = (day: number) => {
    if (novenaInstance.completedDays.includes(day)) return 'completed'
    if (day < currentDayOfNovena) return 'late'
    if (day === currentDayOfNovena) return 'current'
    if (day > currentDayOfNovena) return 'future'
    return 'available'
  }

  const getStatusColor = (status: string, isSelected: boolean) => {
    let base = ''
    switch (status) {
      case 'completed':
        base = 'bg-green-500 text-white border-green-500'; break;
      case 'late':
        base = 'bg-red-100 text-red-700 border-red-300'; break;
      case 'current':
        base = 'bg-purple-600 text-white border-purple-600 ring-4 ring-purple-300 shadow-xl animate-pulse'; break;
      case 'available':
        base = 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'; break;
      case 'future':
        base = 'bg-gray-50 text-gray-400 border-gray-200'; break;
      default:
        base = 'bg-gray-100 text-gray-700 border-gray-300'; break;
    }
    if (isSelected) {
      return base + ' ring-2 ring-blue-500 scale-110 transform border-blue-500';
    }
    return base;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
        <h3 className="text-lg font-semibold">Navegação da Novena</h3>
        {selectedDay && selectedDay !== currentDayOfNovena && (
          <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full self-start sm:self-auto">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Visualizando Dia {selectedDay}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-2 sm:gap-3">
        {novenaData.days.map((dayData) => {
          const status = getDayStatus(dayData.day)
          const isSelected = dayData.day === selectedDay
          const isCompleted = novenaInstance.completedDays.includes(dayData.day)
          const dayDate = addDays(startDateObj, dayData.day - 1)
          const isClickable = status !== 'future'
          const canMark = (status === 'available' || status === 'late' || status === 'current')
          return (
            <div key={dayData.day} className="flex flex-col items-center">
              <button
                onClick={() => isClickable && handleDayClick(dayData.day)}
                disabled={!isClickable}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-medium text-xs sm:text-sm
                  transition-all duration-200 mb-1 relative
                  ${getStatusColor(status, isSelected)}
                  ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
                  ${status === 'available' ? 'hover:scale-105' : ''}
                `}
                title={`Dia ${dayData.day}: ${dayData.title}`}
              >
                {dayData.day}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
              <span className="text-xs text-gray-500 text-center leading-tight">
                {format(dayDate, 'dd/MM', { locale: ptBR })}
              </span>
              {canMark && (
                <button
                  onClick={() => markDay(novenaId, dayData.day)}
                  className={`mt-1 px-2 py-0.5 rounded text-xs font-medium transition-colors
                    ${isCompleted ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                  title={isCompleted ? 'Desmarcar como rezado' : 'Marcar como rezado'}
                >
                  {isCompleted ? 'Desmarcar' : 'Marcar'}
                </button>
              )}
              {isSelected && (
                <span className="text-xs text-blue-600 font-medium mt-1">
                  Visualizando
                </span>
              )}
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-white"></div>
          <span>Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-purple-600"></div>
          <span>Dia atual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Completado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300"></div>
          <span>Atrasado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-300"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-50 border border-gray-200"></div>
          <span>Futuro</span>
        </div>
      </div>
    </div>
  )
}