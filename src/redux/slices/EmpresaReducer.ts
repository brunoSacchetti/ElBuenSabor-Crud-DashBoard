
  // src/redux/slices/empresaSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IEmpresa from '../../types/Empresa';
  
  interface EmpresaState {
    data: IEmpresa[];
    empresaId: number | null;
    empresaActual: IEmpresa | null;
    loading: boolean;
    error: string | null;
  }
  
  const initialState: EmpresaState = {
    data: [],
    empresaId: null,
    empresaActual: null,
    loading: false,
    error: null,
  };
  
  export const empresaSlice = createSlice({
    name: 'empresa',
    initialState,
    reducers: {
      setData: (state, action: PayloadAction<IEmpresa[]>) => {
        state.data = action.payload;
      },
      setEmpresaId: (state, action: PayloadAction<number>) => {
        state.empresaId = action.payload;
      },
      setEmpresaActual: (state, action: PayloadAction<IEmpresa>) => {
        state.empresaActual = action.payload;
      },
      setLoading: (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload;
      },
      setError: (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      },
      removeEmpresaActive: (state) => {
        state.empresaActual = null;
      }
    },
  });
  
  export const { setData, setEmpresaId, setEmpresaActual, setLoading, setError, removeEmpresaActive } = empresaSlice.actions;
  export default empresaSlice.reducer;
  