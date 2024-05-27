// src/redux/slices/sucursalesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ISucursales from '../../types/Sucursales';

interface SucursalesState {
  data: ISucursales[];
  sucursalId: number | null;
  sucursalActual: ISucursales | null;
  loading: boolean;
  error: string | null;
}

const initialState: SucursalesState = {
  data: [],
  sucursalId: null,
  sucursalActual: null,
  loading: false,
  error: null,
};

export const sucursalesSlice = createSlice({
  name: 'sucursales',
  initialState,
  reducers: {
    setDataSucursales: (state, action: PayloadAction<ISucursales[]>) => {
      state.data = action.payload;
    },
    setSucursalId: (state, action: PayloadAction<number>) => {
      state.sucursalId = action.payload;
    },
    setSucursalActual: (state, action: PayloadAction<ISucursales>) => {
      state.sucursalActual = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    removeSucursalActive: (state) => {
      state.sucursalActual = null;
    }
  },
});

export const { setDataSucursales, setSucursalId, setSucursalActual, setLoading, setError, removeSucursalActive } = sucursalesSlice.actions;
export default sucursalesSlice.reducer;
