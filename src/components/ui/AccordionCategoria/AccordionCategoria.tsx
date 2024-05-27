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
}

interface AccordionCategoriaProps {
  categories: ICategoria[];
}

export var Categoria: React.FC<CategoriaProps> = ({ id, denominacion, subCategorias }) => (
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
        <AccordionCategoria categories={subCategorias} />
      )}
    </AccordionDetails>
    <AccordionActions>
      <Button variant="contained" color="primary">
        Agregar Subcategoría
      </Button>
    </AccordionActions>
  </Accordion>
);

export const AccordionCategoria: React.FC<AccordionCategoriaProps> = ({ categories }) => (
  <>
    {categories.map((category) => (
      <Categoria key={category.id} {...category} />
    ))}
  </>
);
