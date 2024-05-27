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
  imageUrl?: string | null;
}

export const CardEmpresa: React.FC<MediaCardProps> = ({ empresa, onDelete, onEdit, onSelect, imageUrl }) => {
  
  const defaultImageUrl = 'https://th.bing.com/th/id/OIP.85Afj-Uwn6gr70bOie8WFgHaHa?rs=1&pid=ImgDetMain';

  return (
    <Card sx={{ maxWidth: 345 }}>
      <img src={imageUrl || defaultImageUrl} alt={`${empresa.nombre} logo`} style={{ width: '100%', height: 'auto' }} />
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
