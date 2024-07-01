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
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface CategoriaProps {
  id: number;
  denominacion: string;
  subCategorias?: ICategoria[];
  eliminado:boolean;
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

export const Categoria: React.FC<CategoriaProps> = ({ id, denominacion,eliminado, subCategorias, onEdit, onAddSubcategoria, onDelete }) => (
  <Accordion sx={{ width: '80%', margin: '1rem auto !important', boxSizing: 'border-box',backgroundColor: eliminado ? 'grey' : 'inherit' }}>
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
        <Button variant="contained" style={{ pointerEvents: eliminado ? "none" : "auto" }} color="primary" onClick={() => onAddSubcategoria(id)}>
          Agregar Subcategoría
        </Button>
      )}
      {eliminado ? (
      <Button  style={{ borderRadius: '50px' }} variant="contained" color="success" onClick={() => onDelete(id)}>
      Habilitar
      <Visibility style={{ marginLeft: '6px' }} />
      </Button>
      ) : (
        <Button  style={{ borderRadius: '50px' }} variant="contained" color="error" onClick={() => onDelete(id)}>
        Deshabilitar
        <VisibilityOff style={{ marginLeft: '6px' }} />
        </Button> )}

        
      <Button variant="contained"  style={{ pointerEvents: eliminado ? "none" : "auto" }} onClick={() => onEdit(id)}>
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
