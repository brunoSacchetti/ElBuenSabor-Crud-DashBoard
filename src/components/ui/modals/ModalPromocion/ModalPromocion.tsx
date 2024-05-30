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
import { ArticuloManufacturadoService } from "../../../../services/ArticuloManufacturadoService";
import { InsumoGetService } from "../../../../services/InsumoGetService";
import { handleSuccess } from "../../../../helpers/alerts";
import ProductoPost from "../../../../types/post/ProductoPost";
import { ProductoDetalleService } from "../../../../services/ProductoDetalleService";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import IUnidadMedida from "../../../../types/UnidadMedida";
import { ICategoria } from "../../../../types/Categoria";
import { CategoriaService } from "../../../../services/CategoriaService";
import { TablePruebaModal2 } from "../../TablePruebaModal2/TablePruebaModal2";
import IArticuloInsumo from "../../../../types/ArticuloInsumo";
import { UnidadMedidaGetService } from "../../../../services/UnidadMedidaGetService";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { Table } from "react-bootstrap";
import { SucursalService } from "../../../../services/SucursalService";
import PromocionPostDto from "../../../../types/Dtos/PromocionDto/PromocionPostDto";
import TextFieldValue from "../../TextFildValue/TextFildValue";
import { PromocionService } from "../../../../services/PromocionService";
import { ArticulosPromoModal } from "./ArticulosPromoModal";

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
  idSucursales: [1], // Depende de cómo quieras inicializarlo
  detalles: [
    {
      cantidad: 4,
      idArticulo: 1,
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
  const [selectedUnidadMedidaId, setSelectedUnidadMedidaId] =
    useState<number>();
  //const [selectedDetalle, setSelectedDetalle] = useState<any[]>([]);
  const [unidadMedida, setUnidadMedida] = useState<IUnidadMedida[]>([]);
  const [categoria, setCategoria] = useState<ICategoria[]>([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number>(1);
  //const [openInsumosModal, setOpenInsumosModal] = useState<boolean>(false);
  const [dataIngredients, setDataIngredients] = useState<any[]>([]);

  // --------------
  // #region STATES - Promociones
  const [itemValue, setItemValue] = useState<PromocionPostDto>(initialValues);
  const [openInsumosModal, setOpenInsumosModal] = useState<boolean>(false);
  const [selectedDetalle, setSelectedDetalle] = useState<any[]>([]);

  const sucursales = useAppSelector((state) => state.sucursal.data);
  const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);

  const unidadMedidaService = new UnidadMedidaGetService(
    `${API_URL}/UnidadMedida`
  );
  const productoManufacturadoService = new ArticuloManufacturadoService(
    `${API_URL}/ArticuloManufacturado`
  );
  const productoDetalleService = new ProductoDetalleService(
    `${API_URL}/ArticuloManufacturadoDetalle`
  );
  const insumosServices = new InsumoGetService(`${API_URL}/ArticuloInsumo`);
  const categoriaService = new CategoriaService(`${API_URL}/categoria`);

  //#region SERVICE - Promociones
  const sucursalService = new SucursalService(`${API_URL}/sucursal`);
  const promocionService = new PromocionService(`${API_URL}/promocion`);

  //obtenemos la sucursal actual

  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.tablaReducer.elementActive);
  const sucursalActual = useAppSelector(
    (state) => state.sucursal.sucursalActual
  );
  const getUnidadMedida = async () => {
    try {
      const data = await unidadMedidaService.getAll();
      setUnidadMedida(data);
    } catch (error) {
      console.error("Error al obtener unidades de medida:", error);
    }
  };

  /* const getCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };} */

  const getCategorias = async () => {
    if (!sucursalActual) {
      console.error("Error al obtener categorias: sucursalActual es null");
      return;
    }
    try {
      console.log(sucursalActual);
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

  const getProductoDetalles = async (productoId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/ArticuloManufacturado/allDetalles/${productoId}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los detalles de los insumos");
      }
      const detallesData = await response.json();
      // Formatear los detalles obtenidos para que coincidan con la estructura esperada
      const formattedDetalles = detallesData.map((detalle: any) => ({
        id: detalle.id, // Asegúrate de que cada detalle tenga un id definido
        cantidad: detalle.cantidad,
        denominacion: detalle.articuloInsumo.denominacion,
      }));
      setSelectedDetalle(formattedDetalles);
    } catch (error) {
      console.error("Error al obtener los detalles de los insumos:", error);
    }
  };

   /* useEffect(() => {
    if (data) {
      const productoData: ProductoPost = data as ProductoPost;
      setItemValue({
        id: productoData.id,
        denominacion: productoData.denominacion,
        precioVenta: productoData.precioVenta,
        tiempoEstimadoMinutos: productoData.tiempoEstimadoMinutos,
        descripcion: productoData.descripcion,
        preparacion: productoData.preparacion,
        idsArticuloManufacturadoDetalles:
          productoData.idsArticuloManufacturadoDetalles,
        idUnidadMedida: productoData.idUnidadMedida,
      });
      setSelectedUnidadMedidaId(productoData.idUnidadMedida);
      console.log(productoData.idUnidadMedida);
      

      // Fetch and set the insumos related to the product
      getProductoDetalles(productoData.id); // Esta función se encargará de realizar la llamada a la API y actualizar los detalles de los insumos
    } else {
      resetValues();
    }
  }, [data]); */

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
        detalles: [], // Puedes ajustar esto según sea necesario
      });
      setSelectedSucursales(promocionData.idSucursales);
    } else {
      resetValues();
    }
  }, [data]);
  
  // #region USE EFFECT
  useEffect(() => {
    if (open && sucursalActual) {
      getInsumos();
      getUnidadMedida();
      getCategorias();
    }
  }, [open, sucursalActual]);

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
  console.log(itemValue);

  const handleDateChange = (name: string, value: string) => {
    setItemValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConfirmModal = async () => {
    try {
      // Verifica si hay al menos un detalle agregado
      /* if (selectedDetalle.length === 0) {
        // Muestra un mensaje de error con SweetAlert
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debes agregar al menos un detalle antes de confirmar.",
        });
        return;
      } */

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

      let productoId: number;
      let detallesIds: number[] = [];

      let promocionId: number;

      if (data) {
        //await productoManufacturadoService.put(itemValue.id, itemValue);
        await promocionService.put(itemValue.id, itemValue); 
        promocionId = itemValue.id;
      } else {
        const newPromocion = await promocionService.postOnlyData(
          itemValue
        );
        promocionId = newPromocion.id;
        console.log(promocionId);
      }

      /* await categoriaService.addArticuloManufacturado(
        selectedCategoriaId,
        promocionId
      ); */

      /* await Promise.all(
        selectedDetalle.map(async (detalle) => {
          const newDetalle = {
            id: 0,
            cantidad: detalle.cantidad,
            idArticuloInsumo: detalle.id,
            idArticuloManufacturado: productoId,
          };
          const createdDetalle = await productoDetalleService.postOnlyData(
            newDetalle
          );
          detallesIds.push(createdDetalle.id);
        })
      );

      await productoManufacturadoService.put(productoId, {
        ...itemValue,
        idsArticuloManufacturadoDetalles: detallesIds,
      }); */

      handleSuccess("Elemento guardado correctamente");
      handleClose();
      resetValues();
      getData();
      getUnidadMedida();
      getInsumos();
      dispatch(removeElementActive());
    } catch (error) {
      console.error("Error al confirmar modal:", error);
    }
  };

  /* const handleTableIngredientSelect = (selectedData: any) => {
    const filteredData = selectedData.map((item: any) => ({
      id: item.id,
      cantidad: item.cantidad,
      denominacion: item.denominacion,
    }));
    setSelectedDetalle(filteredData);
  }; */

  /* const handleChangeUnidadMedidaValues = async (
    e: SelectChangeEvent<number>
  ) => {
    const unidadMedidaId = e.target.value as number;
    setSelectedUnidadMedidaId(unidadMedidaId);
    setItemValue({
      ...itemValue,
      idUnidadMedida: unidadMedidaId,
    });
  }; */

  /* const handleChangeCategoriaValues = async (e: SelectChangeEvent<number>) => {
    const categoriaId = e.target.value as number;
    setSelectedCategoriaId(categoriaId);
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
    console.log(updatedDetalle);
    setSelectedDetalle(updatedDetalle);
  };

  /* const handleCheckboxChange = (sucursalId: number) => {
    setSelectedSucursales((prevSelected) =>
      prevSelected.includes(sucursalId)
        ? prevSelected.filter((id) => id !== sucursalId)
        : [...prevSelected, sucursalId]
    );
    console.log("SUCURSAL MARCADA: " + selectedSucursales);
    
  }; */


  /* const handleCheckboxChange = (sucursalId: number) => {
    setSelectedSucursales((prevSelected) => {
      const updatedSelected = prevSelected.includes(sucursalId)
        ? prevSelected.filter((id) => id !== sucursalId)
        : [...prevSelected, sucursalId];

      console.log("SUCURSAL MARCADA: ", updatedSelected);
      return updatedSelected;
    });
  }; */

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
  
      console.log("SUCURSAL MARCADA: ", updatedSelected);
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
                    <label style={{paddingLeft: "5px"}} htmlFor={`sucursal-${sucursal.id}`}>
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
                  style={{ width: "90%" }}
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
                <h1>Insumos</h1>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenInsumosModal}
                >
                  Agregar Insumos
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
        handleAddInsumos={handleAddInsumos} // Cambiar 'onConfirm' a 'handleAddInsumos'
      />
    </div>
  );
};
