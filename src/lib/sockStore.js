import { create } from 'zustand'

const useSockStore = create((set) => ({
  sock: null,
  setSock: (sockInstance) => set({ sock: sockInstance }),
}))

export default useSockStore
