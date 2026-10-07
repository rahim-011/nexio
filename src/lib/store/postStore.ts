
import { create } from "zustand";
import { stepType } from "../types";





interface PostStoreValues{
    currentStep: number,
    updateCurrentStep: (type:stepType) => void,
}

export const usePostStore = create<PostStoreValues>((set,get)=>({
    currentStep:0,
    updateCurrentStep: (type:stepType) =>{
        const currentStep = get().currentStep;
        if (type === 'backward' && currentStep >0){
            set({currentStep:currentStep - 1})
        }else {
            if (type === 'forward' && currentStep < 2){
                set({currentStep:currentStep + 1})
            }
        }
    }
}))