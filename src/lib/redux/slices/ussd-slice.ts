import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransactionWithRelations } from "@/types";

interface UssdState {
  activeTx: TransactionWithRelations | null;
  timeLeft: number;
}

const initialState: UssdState = {
  activeTx: null,
  timeLeft: 30,
};

const ussdSlice = createSlice({
  name: "ussd",
  initialState,
  reducers: {
    SetActiveTx: (state, action: PayloadAction<TransactionWithRelations>) => {
      state.activeTx = action.payload;
      state.timeLeft = 30;
    },
    DecrementTimer: (state) => {
      if (state.timeLeft > 0) state.timeLeft -= 1;
    },
    ClearUssd: (state) => {
      state.activeTx = null;
      state.timeLeft = 30;
    },
  },
});

export const { SetActiveTx, DecrementTimer, ClearUssd } = ussdSlice.actions;
export default ussdSlice.reducer;
