// src/redux/slices/categoriaSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoriaDto } from '../../types/Dtos/CategoriaDto/CategoriaDto';
import { ICategoria } from '../../types/Categoria';

interface CategoriaState {
  data: ICategoria[];
  categoriaId: number | null;
  categoriaActual: CategoriaDto | null;
  loading: boolean;
  error: string | null;
  categoriaPadreId: number | null;
}

const initialState: CategoriaState = {
  data: [],
  categoriaId: null,
  categoriaActual: null,
  loading: false,
  error: null,
  categoriaPadreId: null,
};

export const categoriaSlice = createSlice({
  name: 'categoria',
  initialState,
  reducers: {
    setCategoriaData: (state, action: PayloadAction<ICategoria[]>) => {
      state.data = action.payload;
    },
    setCategoriaId: (state, action: PayloadAction<number>) => {
      state.categoriaId = action.payload;
    },
    setCategoriaActual: (state, action: PayloadAction<CategoriaDto>) => { //ICategoria
      state.categoriaActual = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    removeCategoriaActive: (state) => {
      state.categoriaActual = null;
    },
    setCategoriaPadreId: (state, action: PayloadAction<number | null>) => {
      state.categoriaPadreId = action.payload;
    }
  },
});

export const { setCategoriaData, setCategoriaId, setCategoriaActual, setLoading, setError, removeCategoriaActive,setCategoriaPadreId } = categoriaSlice.actions;
export default categoriaSlice.reducer;
