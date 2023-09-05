import { startOfDay } from 'date-fns'
import { create } from 'zustand'
import { type RouterOutputs } from '~/utils/api'
type Calendar = RouterOutputs['calendar']['getAll'][0]

type State = {
  currentDate: Date
  currentCalendarView: 'Day' | 'Week' | 'Month' | 'Year' | 'None'
  renamingEventNow: boolean
  creatingTimeEventNow: boolean
  selectedCalendar: Calendar | null
  sidebar: boolean
}

type Action = {
  setCurrentDate: (currentDate: State['currentDate']) => void
  setCurrentCalendarView: (
    currentCalendarView: State['currentCalendarView']
  ) => void
  setRenamingEventNow: (renamingEventNow: State['renamingEventNow']) => void
  setCreatingTimeEventNow: (
    creatingTimeEventNow: State['creatingTimeEventNow']
  ) => void
  setSelectedCalendar: (selectedCalendar: State['selectedCalendar']) => void
  setSidebar: (sidebar: State['sidebar']) => void
}

const useStore = create<State & Action>((set) => ({
  currentDate: new Date(),
  setCurrentDate: (state: Date) => set(() => ({ currentDate: state })),
  currentCalendarView: 'None',
  setCurrentCalendarView: (state: State['currentCalendarView']) => {
    set(() => ({ currentCalendarView: state }))
  },
  renamingEventNow: false,
  setRenamingEventNow: (state: boolean) =>
    set(() => ({ renamingEventNow: state })),
  creatingTimeEventNow: false,
  setCreatingTimeEventNow: (state: boolean) =>
    set(() => ({ creatingTimeEventNow: state })),
  selectedCalendar: null,
  setSelectedCalendar: (state: Calendar | null) =>
    set(() => ({ selectedCalendar: state })),
  sidebar: false,
  setSidebar: (state: boolean) => set(() => ({ sidebar: state })),
}))

export default useStore
