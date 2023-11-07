import { create } from 'zustand'
import { type RouterOutputs } from '~/utils/api'
type Calendar = RouterOutputs['calendar']['getAll'][0]
type Note = RouterOutputs['dayNote']['getAll'][0]
type Journal = RouterOutputs['journal']['getAll'][0]

export type State = {
  // Calendar states
  currentDate: Date
  renamingEventNow: boolean
  creatingEventNow: boolean
  selectedCalendar: Calendar | null
  sidebar: boolean
  // "Journal" states
  selectedNote: Note | null
  selectedJournal: Journal | null
  // "Global" states
  creatingWithModal:
    | 'Calendar'
    | 'Journal'
    | 'Note'
    | 'TimeEvent'
    | 'DayEvent'
    | null
  isDarkTheme: boolean
  menu: boolean
}

type Action = {
  // Calendar states
  setCurrentDate: (currentDate: State['currentDate']) => void
  setRenamingEventNow: (renamingEventNow: State['renamingEventNow']) => void
  setCreatingEventNow: (creatingEventNow: State['creatingEventNow']) => void
  setSelectedCalendar: (selectedCalendar: State['selectedCalendar']) => void
  setSidebar: (sidebar: State['sidebar']) => void
  // "Journal" states
  setSelectedNote: (selectedNote: State['selectedNote']) => void
  setSelectedJournal: (selectedJournal: State['selectedJournal']) => void
  // "Global" states
  setCreatingWithModal: (creatingWithModal: State['creatingWithModal']) => void
  setIsDarkTheme: (isDarkTheme: State['isDarkTheme']) => void
  setMenu: (menu: State['menu']) => void
}

const useStore = create<State & Action>((set) => ({
  // Calendar states
  currentDate: new Date(),
  setCurrentDate: (state: State['currentDate']) =>
    set(() => ({ currentDate: state })),
  currentCalendarView: 'None',
  renamingEventNow: false,
  setRenamingEventNow: (state: State['renamingEventNow']) =>
    set(() => ({ renamingEventNow: state })),
  creatingEventNow: false,
  setCreatingEventNow: (state: State['creatingEventNow']) =>
    set(() => ({ creatingEventNow: state })),
  selectedCalendar: null,
  setSelectedCalendar: (state: State['selectedCalendar']) =>
    set(() => ({ selectedCalendar: state })),
  sidebar: true,
  setSidebar: (state: State['sidebar']) => set(() => ({ sidebar: state })),
  // "Journal" states
  selectedNote: null,
  setSelectedNote: (state: State['selectedNote']) =>
    set(() => ({ selectedNote: state })),
  selectedJournal: null,
  setSelectedJournal: (state: State['selectedJournal']) =>
    set(() => ({ selectedJournal: state })),
  // "Global" states
  isDarkTheme: false,
  setIsDarkTheme: (state: State['isDarkTheme']) =>
    set(() => ({ isDarkTheme: state })),
  creatingWithModal: null,
  setCreatingWithModal: (state: State['creatingWithModal']) =>
    set(() => ({ creatingWithModal: state })),
  menu: false,
  setMenu: (state: State['menu']) => set(() => ({ menu: state })),
}))

export default useStore
