'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NovenaInstance {
  id: string
  type: string
  startDate: string
  completedDays: number[]
  createdAt: string
}

interface NovenaState {
  novenas: NovenaInstance[]
  selectedDay: { [novenaId: string]: number | null }
  createNovena: (type: string, startDate: string) => string
  markDay: (novenaId: string, day: number) => void
  setSelectedDay: (novenaId: string, day: number | null) => void
  deleteNovena: (novenaId: string) => void
  getNovena: (novenaId: string) => NovenaInstance | undefined
}

export const useNovenaStore = create<NovenaState>()(
  persist(
    (set, get) => ({
      novenas: [],
      selectedDay: {},
      createNovena: (type, startDate) => {
        const id = `${type}-${Date.now()}`
        const newNovena: NovenaInstance = {
          id,
          type,
          startDate,
          completedDays: [],
          createdAt: new Date().toISOString()
        }
        set({ novenas: [...get().novenas, newNovena] })
        return id
      },
      markDay: (novenaId, day) => {
        const { novenas } = get()
        const updatedNovenas = novenas.map(novena => {
          if (novena.id === novenaId) {
            const completedDays = novena.completedDays.includes(day)
              ? novena.completedDays.filter(d => d !== day)
              : [...novena.completedDays, day]
            return { ...novena, completedDays }
          }
          return novena
        })
        set({ novenas: updatedNovenas })
      },
      setSelectedDay: (novenaId, day) => {
        const { selectedDay } = get()
        set({ selectedDay: { ...selectedDay, [novenaId]: day } })
      },
      deleteNovena: (novenaId) => {
        const { novenas, selectedDay } = get()
        const updatedNovenas = novenas.filter(n => n.id !== novenaId)
        const updatedSelectedDay = { ...selectedDay }
        delete updatedSelectedDay[novenaId]
        set({ novenas: updatedNovenas, selectedDay: updatedSelectedDay })
      },
      getNovena: (novenaId) => {
        return get().novenas.find(n => n.id === novenaId)
      }
    }),
    { name: 'novenas-progress' }
  )
)
