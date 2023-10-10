import { create } from 'zustand'
import { type RouterOutputs } from '~/utils/api'
type Calendar = RouterOutputs['calendar']['getAll'][0]

type State = {
  // Calendar states
  currentDate: Date
  currentCalendarView: 'Day' | 'Week' | 'Month' | 'Year' | 'None'
  renamingEventNow: boolean
  creatingEventNow: boolean
  selectedCalendar: Calendar | null
  sidebar: boolean
  // "Global" states
  isDarkTheme: boolean
  menu: boolean
}

type Action = {
  // Calendar states
  setCurrentDate: (currentDate: State['currentDate']) => void
  setCurrentCalendarView: (
    currentCalendarView: State['currentCalendarView']
  ) => void
  setRenamingEventNow: (renamingEventNow: State['renamingEventNow']) => void
  setCreatingEventNow: (creatingEventNow: State['creatingEventNow']) => void
  setSelectedCalendar: (selectedCalendar: State['selectedCalendar']) => void
  setSidebar: (sidebar: State['sidebar']) => void
  // "Global" states
  setIsDarkTheme: (isDarkTheme: State['isDarkTheme']) => void
  setMenu: (menu: State['menu']) => void
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
  creatingEventNow: false,
  setCreatingEventNow: (state: boolean) =>
    set(() => ({ creatingEventNow: state })),
  selectedCalendar: null,
  setSelectedCalendar: (state: Calendar | null) =>
    set(() => ({ selectedCalendar: state })),
  sidebar: true,
  setSidebar: (state: boolean) => set(() => ({ sidebar: state })),
  isDarkTheme: false,
  setIsDarkTheme: (state: boolean) => set(() => ({ isDarkTheme: state })),
  menu: false,
  setMenu: (state: boolean) => set(() => ({ menu: state })),
}))

export default useStore
