import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import { Delete, Edit, ChevronRight, LocationOn, VisibilityOff } from '@mui/icons-material';
import IEmpresa from '../../../types/Empresa';

interface MediaCardProps {
  empresa: IEmpresa;
  onDelete: (id: number) => void;
  onEdit: (empresa: IEmpresa) => void;
  onSelect: (id: number, empresa: IEmpresa) => void;
}

export const CardGeneric: React.FC<MediaCardProps> = ({ empresa, onDelete, onEdit, onSelect }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {empresa.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Razón Social:</strong> {empresa.razonSocial}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>CUIL:</strong> {empresa.cuil}
        </Typography>
        {empresa.sucursales && empresa.sucursales.length > 0 ? (
          <Button variant="contained" color="success" startIcon={<LocationOn />} onClick={() => onSelect(empresa.id, empresa)}>
            Sucursales
          </Button>
        ) : (
          <Button variant="contained" color="error" startIcon={<VisibilityOff />} onClick={() => alert("No hay sucursales en esta empresa")}>
            Sucursales
          </Button>
        )}
      </CardContent>
      <CardActions>
        <IconButton onClick={() => onEdit(empresa)} aria-label="Editar">
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(empresa.id)} aria-label="Eliminar">
          <Delete />
        </IconButton>
        <IconButton onClick={() => onSelect(empresa.id, empresa)} aria-label="Seleccionar">
          <ChevronRight />
        </IconButton>
      </CardActions>
    </Card>
  );
}

