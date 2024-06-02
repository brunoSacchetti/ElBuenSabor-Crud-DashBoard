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
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import { ICategoria } from "../../../../types/Categoria";
import IArticuloInsumo from "../../../../types/ArticuloInsumo";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { Table } from "react-bootstrap";
import { SucursalService } from "../../../../services/SucursalService";
import PromocionPostDto from "../../../../types/Dtos/PromocionDto/PromocionPostDto";
import { PromocionService } from "../../../../services/PromocionService";
import { ArticulosPromoModal } from "./ArticulosPromoModal";
import { PromocionDetalleService } from "../../../../services/PromocionDetalleService";
import ISucursales from "../../../../types/Sucursales";
import PromocionEditDto from "../../../../types/Dtos/PromocionDto/PromocionEditDto";
import { PromocionPutService } from "../../../../services/PromocionPutService";
import IImagenes from "../../../../types/Imagenes";
import { ImagenService } from "../../../../services/ImagenService";
const API_URL = import.meta.env.VITE_API_URL;

// #region ARREGLAR ID SUCURSAL, PROMOCION DETALLE SIN DETALLE NO SE AGREGA, EL ID NO SE MANDA Y QUEDA EN 0

const initialValues: PromocionPostDto = {
  id: 0,
  denominacion: "",
  fechaDesde: "",
  fechaHasta: "",
  horaDesde: "",
  horaHasta: "", // Agregado para que coincida con la interfaz
  descripcionDescuento: "",
  precioPromocional: 0,
  tipoPromocion: "",
  idSucursales: [], // Depende de cómo quieras inicializarlo
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

export const ModalPromocion: FC<IMasterDetailModal> = ({
  handleClose,
  open,
  getData,
}) => {


  const [categoria, setCategoria] = useState<ICategoria[]>([]);

  const [dataIngredients, setDataIngredients] = useState<any[]>([]);
 

  // #region STATES - Promociones
  const [itemValue, setItemValue] = useState<PromocionPostDto>(initialValues);
  const [openInsumosModal, setOpenInsumosModal] = useState<boolean>(false);
  const [selectedDetalle, setSelectedDetalle] = useState<any[]>([]);
 
  const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);

  

  //#region SERVICE - Promociones
  const sucursalService = new SucursalService(`${API_URL}/sucursal`);
  const promocionService = new PromocionService(`${API_URL}/promocion`);
  const promocionDetalleService = new PromocionDetalleService(`${API_URL}/promocionDetalle`);
  const insumosServices = new InsumoGetService(`${API_URL}/ArticuloInsumo`);
  const promocionPutService = new PromocionPutService(`${API_URL}/promocion`);
  //obtenemos la sucursal actual

  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.tablaReducer.elementActive);
  const sucursales = useAppSelector((state) => state.sucursal.data);
  const sucursalActual = useAppSelector(
    (state) => state.sucursal.sucursalActual
  );

  const getCategorias = async () => {
    if (!sucursalActual) {
      console.error("Error al obtener categorias: sucursalActual es null");
      return;
    }
    try {
      const data = await sucursalService.getCategoriasPorSucursal(
        sucursalActual?.id
      );
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  const getInsumos = async () => {
    try {
      const data = await insumosServices.getAll();
      const insumosNoElaborar: IArticuloInsumo[] = data.filter(
        (insumo) => insumo.esParaElaborar
      );

      setDataIngredients(
        insumosNoElaborar.map((insumo) => ({
          cantidad: 0,
          insumo: insumo,
        }))
      );
    } catch (error) {
      console.error("Error al obtener insumos:", error);
    }
  };

  const getPromocionDetalles = async (promocionId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/promocion/getDetallesByid/${promocionId}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los detalles de los insumos");
      }
      const detallesData = await response.json();
      const formattedDetalles = detallesData.map((detalle: any) => {
        let idArticulo;
        let denominacion;

        if (detalle.manufacturado) {
          idArticulo = detalle.manufacturado.id;
          denominacion = detalle.manufacturado.denominacion;
        } else if (detalle.insumo) {
          idArticulo = detalle.insumo.id;
          denominacion = detalle.insumo.denominacion;
        } 
        return {
          id: detalle.id,
          cantidad: detalle.cantidad,
          denominacion: denominacion,
          idArticulo: idArticulo,
          eliminado: detalle.eliminado  
        };
      });

      setSelectedDetalle(formattedDetalles);


    } catch (error) {
      console.error("Error al obtener los detalles de los insumos:", error);
    }
  };
  useEffect(() => {
    if (data) {
      const promocionData: PromocionPostDto = data as PromocionPostDto;
      setItemValue({
        id: promocionData.id,
        denominacion: promocionData.denominacion,
        fechaDesde: promocionData.fechaDesde,
        fechaHasta: promocionData.fechaHasta,
        horaDesde: promocionData.horaDesde,
        horaHasta: promocionData.horaHasta,
        descripcionDescuento: promocionData.descripcionDescuento,
        precioPromocional: promocionData.precioPromocional,
        tipoPromocion: promocionData.tipoPromocion,
        idSucursales: promocionData.idSucursales,
        detalles: promocionData.detalles,
      });
      setSelectedSucursales(promocionData.idSucursales);
      console.log("Promoción en modo edición:", promocionData);
    } else {
      resetValues();
    }
  }, [data]);
  
  // #region USE EFFECT
  useEffect(() => {
    if (open && sucursalActual) {
      getInsumos();
      getCategorias();
      if (data) {
        // Si hay datos de promoción, establecer las sucursales asociadas
        setSelectedSucursales(data.sucursales.map((sucursal:ISucursales) => sucursal.id));
      }
    }
  }, [open, sucursalActual,]);

  const resetValues = () => {
    setItemValue(initialValues);
    setSelectedDetalle([]);
    setDataIngredients([]);
  };

  // #region HANDLES
  const handlePropsElementsInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setItemValue({
      ...itemValue,
      [name]: value,
    });
  };


  const handleDateChange = (name: string, value: string) => {
    setItemValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConfirmModal = async () => {
  try {
    // Verifica que todos los campos obligatorios estén completos
    if (
      itemValue.denominacion.trim() === "" ||
      itemValue.fechaDesde.trim() === "" ||
      itemValue.fechaHasta.trim() === "" ||
      itemValue.horaDesde.trim() === "" ||
      itemValue.horaHasta.trim() === "" ||
      itemValue.precioPromocional === 0 ||
      itemValue.descripcionDescuento.trim() === "" ||
      itemValue.tipoPromocion.trim() === "" ||
      selectedSucursales.length === 0
    ) {
      // Muestra un mensaje de error con SweetAlert
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor completa todos los campos obligatorios antes de confirmar.",
      });
      return;
    }

    let promocionId: number;
    let detallesIds: number[] = [];

    if (data) {
console.log(itemValue);

      await promocionService.put(itemValue.id, itemValue);
      promocionId = itemValue.id;
    } else {
        // Crea una nueva promoción
        const newDetalleArray = selectedDetalle.map((detalle) => ({
          cantidad: detalle.cantidad,
          idArticulo: detalle.id,
        }))

        
      
        const newItemValue = { ...itemValue, detalles: newDetalleArray };

      
        const newPromocion = await promocionService.postOnlyData(newItemValue);
        promocionId = newPromocion.id;
      }

    // Guarda los detalles de la promoción
    await Promise.all(
      selectedDetalle.map(async (detalle) => {
        const newDetalle = {
          cantidad: detalle.cantidad,
          idArticulo: detalle.id,
          promocionId: promocionId,
        };
        const createdDetalle = await promocionDetalleService.postOnlyData(
          newDetalle
        );
        detallesIds.push(createdDetalle.id);
      })
    );

    // Muestra un mensaje de éxito con SweetAlert
    await Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Promoción guardada correctamente.",
    });

    // Cierra el modal y actualiza los datos
    handleClose();
    resetValues();
    getData();
    dispatch(removeElementActive());
  } catch (error) {
    console.error("Error al confirmar modal:", error);
  }
};

/* const handleConfirmModal = async () => {
  try {
    // Verifica que todos los campos obligatorios estén completos
    if (
      itemValue.denominacion.trim() === "" ||
      itemValue.fechaDesde.trim() === "" ||
      itemValue.fechaHasta.trim() === "" ||
      itemValue.horaDesde.trim() === "" ||
      itemValue.horaHasta.trim() === "" ||
      itemValue.precioPromocional === 0 ||
      itemValue.descripcionDescuento.trim() === "" ||
      itemValue.tipoPromocion.trim() === "" ||
      selectedSucursales.length === 0
    ) {
      // Muestra un mensaje de error con SweetAlert
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor completa todos los campos obligatorios antes de confirmar.",
      });
      return;
    }

    let promocionId: number;
    let detallesIds: number[] = [];

    if (data) {
      // Modo edición
      const updatedFields: PromocionEditDto = {
        fechaDesde: itemValue.fechaDesde,
        fechaHasta: itemValue.fechaHasta,
        horaDesde: itemValue.horaDesde,
        horaHasta: itemValue.horaHasta,
        precioPromocional: itemValue.precioPromocional,
        detalles: itemValue.detalles,
      };

      await promocionPutService.put(itemValue.id, updatedFields);
      promocionId = itemValue.id;
    } else {
      // Modo creación
      // Aquí creas el objeto de datos reducido con los campos necesarios
      const newData = {
        id: itemValue.id,
        denominacion: itemValue.denominacion,
        fechaDesde: itemValue.fechaDesde,
        fechaHasta: itemValue.fechaHasta,
        horaDesde: itemValue.horaDesde,
        horaHasta: itemValue.horaHasta,
        descripcionDescuento: itemValue.descripcionDescuento,
        precioPromocional: itemValue.precioPromocional,
        tipoPromocion: itemValue.tipoPromocion,
        idSucursales: selectedSucursales,
        detalles: selectedDetalle.map(detalle => ({
          cantidad: detalle.cantidad,
          idArticulo: detalle.id,
        })),
      };

      // Luego lo envías al servicio como lo haces actualmente
      const newPromocion = await promocionService.postOnlyData(newData);
      promocionId = newPromocion.id;
    }

    // Resto del código para guardar los detalles de la promoción y mostrar mensajes

  } catch (error) {
    console.error("Error al confirmar modal:", error);
  }
}; */





  const handleOpenInsumosModal = () => {
    setOpenInsumosModal(true);
  };

  const handleCloseInsumosModal = () => {
    setOpenInsumosModal(false);
  };

  const handleAddInsumos = (selectedInsumos: any[]) => {
    setSelectedDetalle([...selectedDetalle, ...selectedInsumos]);
    handleCloseInsumosModal();
  };


    
 
 
  const handleRemoveInsumo = (id: number) => {
    const updatedDetalle = selectedDetalle.filter(
      (detalle) => detalle.id !== id
    );
  
    setSelectedDetalle(updatedDetalle);

    
  };


  const handleCheckboxChange = (sucursalId: number) => {
    setSelectedSucursales((prevSelected) => {
      const updatedSelected = prevSelected.includes(sucursalId)
        ? prevSelected.filter((id) => id !== sucursalId)
        : [...prevSelected, sucursalId];
  
      // Actualizar itemValue con los ids de las sucursales seleccionadas
      setItemValue((prevItemValue) => ({
        ...prevItemValue,
        idSucursales: updatedSelected,
      }));
  
  
      return updatedSelected;
    });
  };
  
  const handleTipoPromocionChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    setItemValue({
      ...itemValue,
      tipoPromocion: value,
    });
  };

  const elementActive = useAppSelector(
    (state) => state.tablaReducer.elementActive
  );

  return (
    <div>
      <Modal
        open={open}
        style={{ zIndex: 200 }}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalContainerContent}>
            <div style={{ textAlign: "center" }}>
              <h1>{data ? "Editar" : "Crear"} una Promocion</h1>
            </div>
            <div className={styles.productContainer}>
              <div className={styles.productContainerInputs}>
                <TextField
                  label="Nombre"
                  type="text"
                  name="denominacion"
                  onChange={handlePropsElementsInputs}
                  value={itemValue.denominacion}
                  variant="filled"
                  style={{ display: !elementActive ? "block" : "none" }}
                />
                <TextField
                  type="number"
                  value={itemValue.precioPromocional}
                  onChange={handlePropsElementsInputs}
                  name="precioPromocional"
                  label="Precio Promocional"
                  variant="filled"
                  defaultValue={0}
                />
                <TextField
                  type="date"
                  value={itemValue.fechaDesde}
                  onChange={(e) => handleDateChange('fechaDesde', e.target.value)}
                  name="fechaDesde"
                  label="Fecha Desde"
                  variant="filled"
                  

                />
                <TextField
                  type="date"
                  value={itemValue.fechaHasta}
                  onChange={(e) => handleDateChange('fechaHasta', e.target.value)}
                  name="fechaHasta"
                  label="Fecha Hasta"
                  variant="filled"
                />
                <TextField
                  type="time"
                  value={itemValue.horaDesde}
                  onChange={handlePropsElementsInputs}
                  name="horaDesde"
                  label="Hora Desde"
                  variant="filled"
                />
                <TextField
                  type="time"
                  value={itemValue.horaHasta}
                  onChange={handlePropsElementsInputs}
                  name="horaHasta"
                  label="Hora Hasta"
                  variant="filled"
                />

                <h3
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  Tipo de Promocion
                </h3>
                <Select
                  label="Tipo de Promoción"
                  value={itemValue.tipoPromocion}
                  onChange={handleTipoPromocionChange}
                  name="tipoPromocion"
                  variant="filled"
                  style={{ display: !elementActive ? "block" : "none" }}
                >
                  <MenuItem value="HAPPY_HOUR">Happy Hour</MenuItem>
                  <MenuItem value="PROMOCION">Promoción</MenuItem>
                </Select>
              </div>
            </div>
            <div>
              <div style={{ textAlign: "center", marginBottom: "20px", marginTop: "20px" }}>
                <h4>Selecciona las Sucursales</h4>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingBottom: "10px",
                  fontSize: "20px"
                }}
              >
                {sucursales.map((sucursal) => (
                  <div key={sucursal.id}>
                    <input
                      type="checkbox"
                      id={`sucursal-${sucursal.id}`}
                      checked={selectedSucursales.includes(sucursal.id)}
                      onChange={() => handleCheckboxChange(sucursal.id)}
                      
                    />
                    <label  htmlFor={`sucursal-${sucursal.id}`}>
                      {sucursal.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ textAlign: "center" }}>
                <h4>Descripcion adicional de la promocion</h4>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  marginBottom: "2vh",
                }}
              >
                <TextField
                  style={{ display: !elementActive ? "block" : "none" , width: "90%" }}
                  label="Descripcion"
                  type="text"
                  value={itemValue.descripcionDescuento}
                  onChange={handlePropsElementsInputs}
                  name="descripcionDescuento"
                  variant="filled"
                  
                  multiline
                  rows={4}
                  
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h1>Articulos</h1>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenInsumosModal}
                >
                  Agregar Articulos
                </Button>
              </div>
            </div>
            <div className={styles.ingredientesTableContainer}>
              {selectedDetalle.length > 0 ? (
                <TableContainer component={Paper} style={{ maxWidth: "80%" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Nombre</TableCell>
                        <TableCell align="center">Cantidad</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedDetalle.map((detalle) => (
                        <TableRow key={detalle.id}>
                          <TableCell align="center">
                            {detalle.denominacion}
                          </TableCell>
                          <TableCell align="center">
                            {detalle.cantidad}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="outlined"
                              color="info"
                              onClick={() => handleRemoveInsumo(detalle.id)}
                              startIcon={<DeleteIcon />}
                            >
                              Quitar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <div>No hay articulos agregados</div>
              )}
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Button variant="contained" color="error" onClick={handleClose}>
                  Cerrar Modal
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleConfirmModal}
                  style={{ marginLeft: "1rem" }}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <ArticulosPromoModal
        open={openInsumosModal}
        handleClose={handleCloseInsumosModal}
        handleAddInsumos={handleAddInsumos}
      />
    </div>
  );
};
