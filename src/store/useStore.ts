import { startOfDay } from 'date-fns'
import { create } from 'zustand'

type State = {
  currentDate: Date
  currentCalendarView: 'Day' | 'Week' | 'Month' | 'Year' | 'None'
  renamingEventNow: boolean
}

type Action = {
  setCurrentDate: (currentDate: State['currentDate']) => void
  setCurrentCalendarView: (
    currentCalendarView: State['currentCalendarView']
  ) => void
  setRenamingEventNow: (renamingEventNow: State['renamingEventNow']) => void
}

const useStore = create<State & Action>((set) => ({
  currentDate: startOfDay(new Date()),
  setCurrentDate: (state: Date) => set(() => ({ currentDate: state })),
  currentCalendarView: 'None',
  setCurrentCalendarView: (state: State['currentCalendarView']) => {
    set(() => ({ currentCalendarView: state }))
  },
  renamingEventNow: false,
  setRenamingEventNow: (state: boolean) =>
    set(() => ({ renamingEventNow: state })),
}))

export default useStore
