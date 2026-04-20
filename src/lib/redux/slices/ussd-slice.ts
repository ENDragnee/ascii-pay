import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransactionWithRelations } from "@/types";

interface UssdState {
  activeTx: TransactionWithRelations | null;
  queue: TransactionWithRelations[];
  timeLeft: number;
}

const initialState: UssdState = {
  activeTx: null,
  queue: [],
  timeLeft: 30,
};

const ussdSlice = createSlice({
  name: "ussd",
  initialState,
  reducers: {
    // When a new USSD hits the phone, add it to the waitlist
    PushToQueue: (state, action: PayloadAction<TransactionWithRelations>) => {
      // Prevent duplicates if SSE double-fires
      const exists = state.queue.find((t) => t.id === action.payload.id);
      if (!exists && state.activeTx?.id !== action.payload.id) {
        state.queue.push(action.payload);
      }
    },
    // Move the first item from queue to the screen
    ProcessNextInQueue: (state) => {
      if (state.queue.length > 0 && !state.activeTx) {
        state.activeTx = state.queue.shift() || null;
        state.timeLeft = 30;
      }
    },
    DecrementTimer: (state) => {
      if (state.timeLeft > 0) state.timeLeft -= 1;
    },
    ClearActiveTx: (state) => {
      state.activeTx = null;
      state.timeLeft = 30;
    },
  },
});

export const {
  PushToQueue,
  ProcessNextInQueue,
  DecrementTimer,
  ClearActiveTx,
} = ussdSlice.actions;
export default ussdSlice.reducer;
