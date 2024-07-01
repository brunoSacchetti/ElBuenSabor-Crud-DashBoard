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
  onEdit: (id: number) => void;
  onAddSubcategoria: (parentId: number | null) => void;
  onDelete: (id:number) => void;
}


interface AccordionCategoriaProps {
  categories: ICategoria[];
  onEdit: (id: number) => void;
  onAddSubcategoria: (id:number | null) => void;
  onDelete: (id: number) => void;
}

export const Categoria: React.FC<CategoriaProps> = ({ id, denominacion, subCategorias, onEdit, onAddSubcategoria, onDelete }) => (
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
         <AccordionCategoria categories={subCategorias} onEdit={onEdit} onAddSubcategoria={onAddSubcategoria} onDelete={onDelete} />
      )}
    </AccordionDetails>
    <AccordionActions>
      {subCategorias && (  // Mostrar el botón solo si no hay subcategorías definidas
        <Button variant="contained" color="primary" onClick={() => onAddSubcategoria(id)}>
          Agregar Subcategoría
        </Button>
      )}
      <Button variant="contained" color="secondary" onClick={() => onDelete(id)}>
        Eliminar
      </Button>
      <Button variant="contained" onClick={() => onEdit(id)}>
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
      onEdit={onEdit} // Pasamos el handler de onEdit
      onAddSubcategoria={onAddSubcategoria}
      onDelete={onDelete} 
    />
  ))}
</>
);
