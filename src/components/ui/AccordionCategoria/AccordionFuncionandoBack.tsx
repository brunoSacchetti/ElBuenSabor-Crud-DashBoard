import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ICategoria } from '../../../types/Categoria';

interface CategoriaProps {
  id: number;
  denominacion: string;
  subCategorias?: ICategoria[]; // Cambiado a ICategoria[] | undefined
  onEdit: () => void;
  onAddSubcategoria: (parentId: number | null) => void;
  onDelete: (id: number) => void;
}

interface AccordionCategoriaProps {
  categories: ICategoria[];
  onEdit: (category: ICategoria) => void;
  onAddSubcategoria: (id: number | null) => void;
  onDelete: (id: number) => void;
}

export const Categoria: React.FC<CategoriaProps> = ({
  id,
  denominacion,
  subCategorias,
  onEdit,
  onAddSubcategoria,
  onDelete,
}) => (
  <Accordion sx={{ width: '80%', margin: '1rem auto !important', boxSizing: 'border-box' }}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls={`panel-${id}-content`}
      id={`panel-${id}-header`}
    >
      {denominacion}
    </AccordionSummary>
    <AccordionDetails sx={{ width: '100%', padding: '0 1rem' }}>
      {subCategorias && subCategorias.length > 0 && (
        <AccordionCategoria
          categories={subCategorias}
          onEdit={onEdit}
          onAddSubcategoria={onAddSubcategoria}
          onDelete={onDelete}
        />
      )}
    </AccordionDetails>
    <AccordionActions>
      {subCategorias && subCategorias.length === 0 && (  // Mostrar el botón solo si no hay subcategorías definidas
        <Button variant="contained" color="primary" onClick={() => onAddSubcategoria(id)}>
          Agregar Subcategoría
        </Button>
      )}
      <Button variant="contained" color="secondary" onClick={() => onDelete(id)}>
        Eliminar
      </Button>
      <Button variant="contained" onClick={onEdit}>
        Editar
      </Button>
    </AccordionActions>
  </Accordion>
);

export const AccordionCategoria: React.FC<AccordionCategoriaProps> = ({
  categories,
  onEdit,
  onAddSubcategoria,
  onDelete,
}) => {
  return (
    <>
      {categories.map((categoria) => (
        <Categoria
          key={categoria.id}
          id={categoria.id}
          denominacion={categoria.denominacion}
          subCategorias={categoria.subCategorias} // Asegúrate de pasar subCategorias aquí
          onEdit={() => onEdit(categoria)}
          onAddSubcategoria={onAddSubcategoria}
          onDelete={(id) => onDelete(id)}
        />
      ))}
    </>
  );
};
