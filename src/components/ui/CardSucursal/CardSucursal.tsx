import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import { Delete, Edit, ChevronRight } from '@mui/icons-material';
import ISucursales from '../../../types/Sucursales';

interface CardSucursalProps {
  sucursal: ISucursales;
  onDelete: (id: number) => void;
  onEdit: (sucursal: ISucursales) => void;
  onSelect: (id: number, sucursal: ISucursales) => void;
}

export const CardSucursal: React.FC<CardSucursalProps> = ({ sucursal, onDelete, onEdit, onSelect }) => {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: "20px", border: "1px solid lightgray"}}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {sucursal.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Horario de Apertura:</strong> {sucursal.horarioApertura}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Horario de Cierre:</strong> {sucursal.horarioCierre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Dirección:</strong> {sucursal.domicilio.calle} {sucursal.domicilio.numero}, {sucursal.domicilio.localidad.nombre}, {sucursal.domicilio.localidad.provincia.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Es Casa Matriz:</strong> 
          <span style={{ color: sucursal.esCasaMatriz ? "green" : "red", fontWeight: "bold", marginLeft: "0.5rem" }}>
            {sucursal.esCasaMatriz ? "Sí" : "No"}
          </span>
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={() => onEdit(sucursal)} aria-label="Editar">
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(sucursal.id)} aria-label="Eliminar">
          <Delete />
        </IconButton>
        <IconButton onClick={() => onSelect(sucursal.id, sucursal)} aria-label="Seleccionar">
          <ChevronRight />
        </IconButton>
      </CardActions>
    </Card>
  );
}
