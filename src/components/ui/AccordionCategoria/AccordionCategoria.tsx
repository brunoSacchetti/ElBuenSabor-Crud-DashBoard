import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ICategoria } from '../../../types/Categoria';

interface CategoriaProps {
  id: number;
  denominacion: string;
  subCategorias?: ICategoria[];
  onEdit: () => void;
  onAddSubcategoria: () => void;
  onDelete: () => void;
}

interface AccordionCategoriaProps {
  categories: ICategoria[];
  onEdit: (category: ICategoria) => void;
  onAddSubcategoria: () => void;
  onDelete: (id: number) => void;
}

export const Categoria: React.FC<CategoriaProps> = ({ id, denominacion, subCategorias, onEdit, onAddSubcategoria, onDelete }) => (
  <Accordion sx={{ width: '80%', margin: '1rem auto', boxSizing: 'border-box' }}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls={`panel-${id}-content`}
      id={`panel-${id}-header`}
    >
      {denominacion}
    </AccordionSummary>
    <AccordionDetails sx={{ width: '100%', padding: '0 1rem' }}>
      {subCategorias && subCategorias.length > 0 && (
        <AccordionCategoria categories={subCategorias} onEdit={onEdit} onAddSubcategoria={onAddSubcategoria} onDelete={onDelete} />
      )}
    </AccordionDetails>
    <AccordionActions>
      <Button variant="contained" color="primary" onClick={onAddSubcategoria}>
        Agregar Subcategoría
      </Button>
      <Button variant="contained" color="secondary" onClick={onDelete}>
        Eliminar
      </Button>
      <Button variant="contained" onClick={onEdit}>
        Editar
      </Button>
    </AccordionActions>
  </Accordion>
);

export const AccordionCategoria: React.FC<AccordionCategoriaProps> = ({ categories, onEdit, onAddSubcategoria, onDelete }) => (
  <>
    {categories.map((category) => (
      <Categoria 
        key={category.id} 
        {...category} 
        onEdit={() => onEdit(category)} // Llama a la función onEdit con la categoría correspondiente como argumento
        onAddSubcategoria={onAddSubcategoria} 
        onDelete={() => onDelete(category.id)} // Llama a la función onDelete con el ID de la categoría correspondiente como argumento
      />
    ))}
  </>
);

