import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IEmpleado from '../../types/Empleado';

// Define el estado inicial usando el tipo IEmpleado[]
const initialState: IEmpleado[] = [];

const empleadoSlice = createSlice({
  name: 'empleadoState',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<IEmpleado[]>) => {
      return action.payload;
    },
    resetData: () => {
      return [];
    }
  }
});

export const { setData: setEmpleado, resetData: resetEmpleado } = empleadoSlice.actions;

export default empleadoSlice.reducer;
