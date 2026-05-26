import { create } from "zustand";

interface CompareStore {
  comparedIds: string[];
  addCollegeId: (id: string) => { success: boolean; error?: string };
  removeCollegeId: (id: string) => void;
  clearCompare: () => void;
  isCompared: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  comparedIds: [],
  
  addCollegeId: (id) => {
    const { comparedIds } = get();
    
    // Check for duplicates
    if (comparedIds.includes(id)) {
      return { 
        success: false, 
        error: "This college is already selected for comparison!" 
      };
    }
    
    // Enforce comparison capacity limit of 3
    if (comparedIds.length >= 3) {
      return { 
        success: false, 
        error: "You can compare a maximum of 3 colleges. Please remove one first." 
      };
    }
    
    set({ comparedIds: [...comparedIds, id] });
    return { success: true };
  },
  
  removeCollegeId: (id) => {
    set({ comparedIds: get().comparedIds.filter((item) => item !== id) });
  },
  
  clearCompare: () => {
    set({ comparedIds: [] });
  },
  
  isCompared: (id) => {
    return get().comparedIds.includes(id);
  }
}));
