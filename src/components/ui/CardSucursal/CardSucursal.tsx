import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { Button, IconButton } from '@mui/material';
import { Edit, ChevronRight, Visibility, VisibilityOff } from '@mui/icons-material';
import ISucursales from '../../../types/Sucursales';
import "./CardSucursal.css";

interface CardSucursalProps {
  sucursal: ISucursales;
  onDelete: (id: number) => void;
  onEdit: (sucursal: ISucursales) => void;
  onSelect: (id: number, sucursal: ISucursales) => void;
}

export const CardSucursal: React.FC<CardSucursalProps> = ({ sucursal, onDelete, onEdit, onSelect }) => {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: "20px", border: "1px solid lightgray", position: 'relative' }}>
      {sucursal.eliminado && (
        <div
          className="sucursal-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(211, 211, 211, 0.8)', // Gris claro semitransparente
            zIndex: 1,
            pointerEvents: 'none'
          }}
        ></div>
      )}
      <CardContent>
        <Typography style={{ marginTop: '4px' }} gutterBottom variant="h5" component="div">
          {sucursal.nombre}
        </Typography>
        <Typography style={{ marginTop: '4px' }} variant="body2" color="text.secondary">
          <strong>Horario de Apertura:</strong> {sucursal.horarioApertura}
        </Typography>
        <Typography style={{ marginTop: '4px' }} variant="body2" color="text.secondary">
          <strong>Horario de Cierre:</strong> {sucursal.horarioCierre}
        </Typography>
        <Typography style={{ marginTop: '4px' }} variant="body2" color="text.secondary">
          <strong>Dirección:</strong> {sucursal.domicilio.calle} {sucursal.domicilio.numero}, {sucursal.domicilio.localidad.nombre}, {sucursal.domicilio.localidad.provincia.nombre}
        </Typography>
        <Typography style={{ marginTop: '4px', fontSize: '18px' }} variant="body2" color="text.secondary">
          <strong>Es Casa Matriz:</strong>
          <span style={{ color: sucursal.esCasaMatriz ? "green" : "red", fontWeight: "bold", marginLeft: "0.5rem" }}>
            {sucursal.esCasaMatriz ? "Sí" : "No"}
          </span>
        </Typography>
      </CardContent>
      <CardActions style={{ display: 'flex', justifyContent: 'space-around', padding: '2px', position: 'relative', zIndex: 2, pointerEvents: sucursal.eliminado ? 'none' : 'auto' }}>
        <IconButton onClick={() => onEdit(sucursal)} aria-label="Editar" style={{ pointerEvents: sucursal.eliminado ? 'none' : 'auto' }}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(sucursal.id)} aria-label="Eliminar" style={{ pointerEvents: 'auto', zIndex: 3 }}>
          {sucursal.eliminado ? (
            <Button color="success"><Visibility /></Button>
          ) : (
            <Button style={{ borderRadius: '50px' }} color="error"><VisibilityOff /></Button>
          )}
        </IconButton>
        <IconButton style={{ width: '60%', borderRadius: '50px', zIndex: 3 }} onClick={() => onSelect(sucursal.id, sucursal)} aria-label="Seleccionar">
          <label style={{ fontSize: "18px", fontFamily: 'sans-serif', marginRight: '4px' }}>Seleccionar</label>
          <ChevronRight />
        </IconButton>
      </CardActions>
    </Card>
  );
};
