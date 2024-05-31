import { ChangeEvent, FC, useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import styles from "./MasterDetailModal.module.css";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";

import { InsumoGetService } from "../../../../services/InsumoGetService";
import { handleSuccess } from "../../../../helpers/alerts";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import IUnidadMedida from "../../../../types/UnidadMedida";
import { ICategoria } from "../../../../types/Categoria";
import IArticuloInsumo from "../../../../types/ArticuloInsumo";
import { UnidadMedidaGetService } from "../../../../services/UnidadMedidaGetService";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { Table } from "react-bootstrap";
import { SucursalService } from "../../../../services/SucursalService";
import PromocionPostDto from "../../../../types/Dtos/PromocionDto/PromocionPostDto";
import { PromocionService } from "../../../../services/PromocionService";
import { ArticulosPromoModal } from "./ArticulosPromoModal";

const API_URL = import.meta.env.VITE_API_URL;

const initialValues: PromocionPostDto = {
  id: 0,
  denominacion: "",
  fechaDesde: "",
  fechaHasta: "",
  horaDesde: "",
  horaHasta: "",
  descripcionDescuento: "",
  precioPromocional: 0,
  tipoPromocion: "",
  idSucursales: [1],
  detalles: [
    {
      cantidad: 0,
      idArticulo: 0,
    },
  ],
};

interface IMasterDetailModal {
  open: boolean;
  getData: () => void;
  handleClose: () => void;
}

export const PROMOMODALPRUEBA: FC<IMasterDetailModal> = ({
  handleClose,
  open,
  getData,
}) => {
  const [unidadMedida, setUnidadMedida] = useState<IUnidadMedida[]>([]);
  const [categoria, setCategoria] = useState<ICategoria[]>([]);
  const [dataIngredients, setDataIngredients] = useState<any[]>([]);
  const [itemValue, setItemValue] = useState<PromocionPostDto>(initialValues);
  const [openInsumosModal, setOpenInsumosModal] = useState<boolean>(false);
  const [selectedDetalle, setSelectedDetalle] = useState<any[]>([]);

  const sucursales = useAppSelector((state) => state.sucursal.data);
  const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);
  const unidadMedidaService = new UnidadMedidaGetService(`${API_URL}/UnidadMedida`);
  const insumosServices = new InsumoGetService(`${API_URL}/ArticuloInsumo`);
  const sucursalService = new SucursalService(`${API_URL}/sucursal`);
  const promocionService = new PromocionService(`${API_URL}/promocion`);

  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.tablaReducer.elementActive);
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);

  const getUnidadMedida = async () => {
    try {
      const data = await unidadMedidaService.getAll();
      setUnidadMedida(data);
    } catch (error) {
      console.error("Error al obtener unidades de medida:", error);
    }
  };

  const getCategorias = async () => {
    if (!sucursalActual) {
      console.error("Error al obtener categorias: sucursalActual es null");
      return;
    }
    try {
      console.log(sucursalActual);
      const data = await sucursalService.getCategoriasPorSucursal(sucursalActual?.id);
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  const getInsumos = async () => {
    try {
      const data: IArticuloInsumo[] = await insumosServices.getAll();

      // Filtrar los insumos que no son para elaborar
      const insumosNoElaborar: IArticuloInsumo[] = data.filter(
        (insumo) => !insumo.esParaElaborar // NO SON PARA ELABORAR
      );

      return insumosNoElaborar;
    } catch (error) {
      console.error("Error al obtener insumos:", error);
      return [];
    }
  };

  useEffect(() => {
    if (open) {
      getUnidadMedida();
      getCategorias();
      fetchInsumos();
    }
  }, [open]);

  const fetchInsumos = async () => {
    if (open) {
      const insumosData = await getInsumos();
      setDataIngredients(insumosData);
    }
  };

  const handleAddInsumos = (selectedInsumos: any[]) => {
    const newDetails = selectedInsumos.map((insumo) => ({
      cantidad: insumo.cantidad,
      idArticulo: insumo.id,
    }));

    setSelectedDetalle((prevDetalle) => [...prevDetalle, ...newDetails]);
  };

  const handleChange =
    (prop: keyof PromocionPostDto) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setItemValue({ ...itemValue, [prop]: event.target.value });
    };

    const handleSelectChange = (event: SelectChangeEvent<string | number[]>) => {
      const { value } = event.target;
      setSelectedSucursales(Array.isArray(value) ? value.map(Number) : [Number(value)]);
    };

  const handleOpenInsumosModal = () => {
    setOpenInsumosModal(true);
  };

  const handleCloseInsumosModal = () => {
    setOpenInsumosModal(false);
  };

  const handleRemoveDetalle = (index: number) => {
    const newDetails = [...selectedDetalle];
    newDetails.splice(index, 1);
    setSelectedDetalle(newDetails);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newItemValue = {
      ...itemValue,
      idSucursales: selectedSucursales,
      detalles: selectedDetalle,
    };

    try {
      if (itemValue.id === 0) {
        await promocionService.post("http://localhost:8080/promocion" , newItemValue);
        handleSuccess("La promoción se ha creado correctamente.");
      } else {
        await promocionService.put(itemValue.id, newItemValue);
        handleSuccess("La promoción se ha actualizado correctamente.");
      }
      handleClose();
      getData();
    } catch (error) {
      console.error("Error al guardar la promoción:", error);
      Swal.fire("Error", "Hubo un problema al guardar la promoción.", "error");
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Paper className={styles.modalContent}>
          <h2>{itemValue.id === 0 ? "Crear Promoción" : "Editar Promoción"}</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Denominación"
              value={itemValue.denominacion}
              onChange={handleChange("denominacion")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Fecha Desde"
              type="date"
              value={itemValue.fechaDesde}
              onChange={handleChange("fechaDesde")}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha Hasta"
              type="date"
              value={itemValue.fechaHasta}
              onChange={handleChange("fechaHasta")}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Hora Desde"
              type="time"
              value={itemValue.horaDesde}
              onChange={handleChange("horaDesde")}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Hora Hasta"
              type="time"
              value={itemValue.horaHasta}
              onChange={handleChange("horaHasta")}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Descripción del Descuento"
              value={itemValue.descripcionDescuento}
              onChange={handleChange("descripcionDescuento")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Precio Promocional"
              type="number"
              value={itemValue.precioPromocional}
              onChange={handleChange("precioPromocional")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Tipo de Promoción"
              value={itemValue.tipoPromocion}
              onChange={handleChange("tipoPromocion")}
              fullWidth
              margin="normal"
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenInsumosModal}
            >
              Agregar Insumos
            </Button>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Insumo</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedDetalle.map((detalle, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {dataIngredients.find((ing) => ing.id === detalle.idArticulo)?.denominacion}
                      </TableCell>
                      <TableCell>{detalle.cantidad}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleRemoveDetalle(index)}
                          startIcon={<DeleteIcon />}
                          color="secondary"
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
            >
              {itemValue.id === 0 ? "Crear Promoción" : "Guardar Cambios"}
            </Button>
          </form>
        </Paper>
      </Modal>

      <ArticulosPromoModal
        open={openInsumosModal}
        handleClose={handleCloseInsumosModal}
        handleAddInsumos={handleAddInsumos}
      />
    </>
  );
};
