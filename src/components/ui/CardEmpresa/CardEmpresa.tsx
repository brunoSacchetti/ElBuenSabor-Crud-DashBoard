import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import { Visibility, Edit, ChevronRight, LocationOn, VisibilityOff } from '@mui/icons-material';
import IEmpresa from '../../../types/Empresa';

import { EmpresaService } from '../../../services/EmpresaService'; // Asegúrate de importar correctamente tu servicio

interface MediaCardProps {
  empresa: IEmpresa;
  onDelete: (id: number) => void;
  onEdit: (empresa: IEmpresa) => void;
  onSelect: (id: number, empresa: IEmpresa) => void;
  imageUrl?: string | null;
}

const API_URL = import.meta.env.VITE_API_URL;

const empresaService = new EmpresaService(API_URL); // Asegúrate de que la URL base sea la correcta

export const CardEmpresa: React.FC<MediaCardProps> = ({ empresa, onDelete, onEdit, onSelect, imageUrl }) => {
  const defaultImageUrl = './nohayfoto.jpg';
  const [tieneSucursales, setTieneSucursales] = React.useState(false);

  // Función para cargar la empresa con sus sucursales
  const cargarEmpresaConSucursales = async () => {
    try {
      const empresaConSucursales = await empresaService.getEmpresaSucursales(empresa.id);
      setTieneSucursales(empresaConSucursales.sucursales.length > 0);
    } catch (error) {
      console.error('Error al cargar la empresa con sucursales:', error);
    }
  };

  React.useEffect(() => {
    cargarEmpresaConSucursales();
  }, []); // Se ejecuta solo una vez al montar el componente

  return (
    <Card sx={{ maxWidth: 345, borderRadius: "20px", border: "1px solid lightgray", position: 'relative' }}>
      {empresa.eliminado && (
        <div
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
      <img src={imageUrl || defaultImageUrl} alt={`${empresa.nombre} logo`} style={{ width: '100%', height: 'auto' }} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {empresa.nombre}
        </Typography>
        <Typography variant="body2" style={{ margin: '8px' }} color="text.secondary">
          <strong>Razón Social:</strong> {empresa.razonSocial}
        </Typography>
        <Typography variant="body2" style={{ margin: '8px' }} color="text.secondary">
          <strong>CUIL:</strong> {empresa.cuil}
        </Typography>
        {tieneSucursales ? (
          <Button variant="contained" color="primary" startIcon={<LocationOn />}>
            Sucursales Disponibles
          </Button>
        ) : (
          <Button variant="contained" color="error" startIcon={<VisibilityOff />}>
            No hay Sucursales
          </Button>
        )}
      </CardContent>
      <CardActions style={{ display: 'flex', justifyContent: 'space-around', padding: '2px', position: 'relative', zIndex: 1, pointerEvents: empresa.eliminado ? 'none' : 'auto' }}>
        <IconButton onClick={() => onEdit(empresa)} aria-label="Editar">
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(empresa.id)} aria-label="Eliminar" style={{ pointerEvents: 'auto' }}> {/* margin: '0 !important' */}
          {empresa.eliminado ? (
            <Button color="success"><Visibility /></Button>
          ) : (
            <Button style={{ borderRadius: '50px' }} color="error"><VisibilityOff /></Button>
          )}
        </IconButton>
        <IconButton style={{ width: '60%', borderRadius: '50px' }} onClick={() => onSelect(empresa.id, empresa)} aria-label="Seleccionar">
          <ChevronRight />
          <label style={{ fontSize: "18px", fontFamily: 'sans-serif' }}>Ver Sucursales</label>
        </IconButton>
      </CardActions>
    </Card>
  );
};
