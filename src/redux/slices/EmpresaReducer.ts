// src/types/Empresa.ts
export interface Empresa {
    id: number;
    nombre: string;
    razonSocial: string;
    cuil: string;
    sucursales?: any[];  // Asumiendo que no has definido un tipo para sucursales
}
  
  // src/redux/slices/empresaSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IEmpresa from '../../types/Empresa';
  
  interface EmpresaState {
    empresaId: number | null;
    empresaActual: IEmpresa | null;
    loading: boolean;
    error: string | null;
  }
  
  const initialState: EmpresaState = {
    empresaId: null,
    empresaActual: null,
    loading: false,
    error: null,
  };
  
  export const empresaSlice = createSlice({
    name: 'empresa',
    initialState,
    reducers: {
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
    },
  });
  
  export const { setEmpresaId, setEmpresaActual, setLoading, setError } = empresaSlice.actions;
  export default empresaSlice.reducer;
  