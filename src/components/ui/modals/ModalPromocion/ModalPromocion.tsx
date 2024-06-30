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

import ISucursales from "../../../../types/Sucursales";

import IImagenes from "../../../../types/Imagenes";
import { ImagenService } from "../../../../services/ImagenService";
import { setLoading } from "../../../../redux/slices/EmpresaReducer";
import { ImageCarrousel } from "../../ImageCarrousel/ImageCarrousel";
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
  const [, setCategoria] = useState<ICategoria[]>([]);
  const [, setDataIngredients] = useState<any[]>([]);
  // #region STATES - Promociones
  const [itemValue, setItemValue] = useState<PromocionPostDto>(initialValues);
  const [openInsumosModal, setOpenInsumosModal] = useState<boolean>(false);
  const [selectedDetalle, setSelectedDetalle] = useState<any[]>([]);

  const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);

  //#region SERVICE - Promociones
  const sucursalService = new SucursalService(`${API_URL}/sucursal`);
  const promocionService = new PromocionService(`${API_URL}/promocion`);
  
  const insumosServices = new InsumoGetService(`${API_URL}/ArticuloInsumo`);
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
          eliminado: detalle.eliminado,
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
      getPromocionDetalles(promocionData.id);
      getImages(promocionData.id);
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
        setSelectedSucursales(
          data.sucursales.map((sucursal: ISucursales) => sucursal.id)
        );
      }
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

  const handleDateChange = (name: string, value: string) => {
    setItemValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [images, setImages] = useState<IImagenes[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const imageService = new ImagenService(API_URL + "/promocion");

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
        selectedSucursales.length === 0 || 
        selectedDetalle.length === 0 
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

      if (data) {
        //const {id, fechaDesde, fechaHasta, horaDesde, horaHasta, precioPromocional, detalles } = itemValue;

        console.log(selectedDetalle);

        const promocionEditada = {
          id: itemValue.id,
          fechaDesde: itemValue.fechaDesde,
          fechaHasta: itemValue.fechaHasta,
          horaDesde: itemValue.horaDesde,
          horaHasta: itemValue.horaHasta,
          precioPromocional: itemValue.precioPromocional,
          detalles: selectedDetalle.map((detalle) => ({
            cantidad: detalle.cantidad,
            idArticulo: detalle.idArticulo || detalle.id, // Ajusta esto según la estructura de tu objeto detalle
          })),
        };

        console.log("PROMO EDITADA:", promocionEditada);

        const promoPutService = new PromocionService(`${API_URL}/promocion`);

        await promoPutService.put(
          itemValue.id,
          promocionEditada as PromocionPostDto
        );

        if (selectedFiles) {
          try {
            Swal.fire({
              title: "Subiendo imágenes...",
              text: "Espere mientras se suben los archivos.",
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading();
              },
            });

            const formData = new FormData();
            Array.from(selectedFiles).forEach((file) => {
              formData.append("uploads", file);
            });

            // Subimos las imágenes solo si están seleccionadas
            await imageService.uploadImages(
              `${API_URL}/promocion/uploads?id=${itemValue.id}`,
              formData
            );
            Swal.fire("Éxito", "Imágenes subidas correctamente", "success");
            //fetchImages();
          } catch (error) {
            Swal.fire(
              "Error",
              "Algo falló al subir las imágenes, inténtalo de nuevo.",
              "error"
            );
          } finally {
            setSelectedFiles(null);
            Swal.close();
          }
        }

      } else {
        // Crea una nueva promoción
        const newDetalleArray = selectedDetalle.map((detalle) => ({
          cantidad: detalle.cantidad,
          idArticulo: detalle.id,
        }));

        const newItemValue = { ...itemValue, detalles: newDetalleArray };

        const newPromocion: any = await promocionService.postOnlyData(
          newItemValue
        );
        
        promocionId = newPromocion.id;
      
      if (selectedFiles) {
        try {
          Swal.fire({
            title: "Subiendo imágenes...",
            text: "Espere mientras se suben los archivos.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          const formData = new FormData();
          Array.from(selectedFiles).forEach((file) => {
            formData.append("uploads", file);
          });

          // Subimos las imágenes solo si están seleccionadas
          await imageService.uploadImages(
            `${API_URL}/promocion/uploads?id=${promocionId}`,
            formData
          );
          Swal.fire("Éxito", "Imágenes subidas correctamente", "success");
          //fetchImages();
        } catch (error) {
          Swal.fire(
            "Error",
            "Algo falló al subir las imágenes, inténtalo de nuevo.",
            "error"
          );
        } finally {
          setSelectedFiles(null);
          Swal.close();
        }
      }
    }

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

  const handleChangeCantidad = (detalleId: number, cantidad: string) => {
    // Convierte la cantidad a un número entero
    const nuevaCantidad = parseInt(cantidad);

    // Verifica si el detalle ya existe en los detalles seleccionados
    const detalleExistenteIndex = selectedDetalle.findIndex(
      (detalle) => detalle.id === detalleId
    );

    if (detalleExistenteIndex !== -1) {
      // Si el detalle existe, actualiza la cantidad
      const updatedDetalles = [...selectedDetalle]; // Crea una copia del arreglo de detalles
      updatedDetalles[detalleExistenteIndex] = {
        ...updatedDetalles[detalleExistenteIndex],
        cantidad: nuevaCantidad,
      }; // Actualiza la cantidad del detalle existente
      setSelectedDetalle(updatedDetalles); // Establece el estado con los nuevos detalles
    } else {
      // Si el detalle no existe, agrega un nuevo detalle con la cantidad especificada
      const nuevoDetalle = {
        id: detalleId,
        cantidad: nuevaCantidad,
      };

      // Agrega el nuevo detalle a los detalles seleccionados
      const updatedDetalles = [...selectedDetalle, nuevoDetalle];

      // Actualiza el estado con los nuevos detalles
      setSelectedDetalle(updatedDetalles);
    }
    console.log(selectedDetalle);
  };

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

  //#region IMAGENES

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
    console.log(event.target.files);
  };

  const getImages = async (id: number) => {
    try {
      setLoading(true);
      const data = await imageService.getImagesByArticuloId(id);
      setImages(data);
    } catch (error) {
      Swal.fire("Error", "Error al obtener las imágenes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (publicId: string, id: number) => {
    try {
      // Realiza la llamada al servicio para eliminar la imagen
      await imageService.deleteImagePromocion(publicId, id);
      // Actualiza la lista de imágenes en el estado local eliminando la imagen eliminada
      setImages(images.filter((image) => image.id !== id));
      // Muestra un mensaje de éxito si la eliminación fue exitosa
      Swal.fire(
        "Imagen eliminada",
        "La imagen se eliminó correctamente",
        "success"
      );
      // Aquí podrías actualizar la lista de imágenes en tu estado o recargar las imágenes del producto
    } catch (error) {
      // Muestra un mensaje de error si la eliminación falla
      Swal.fire("Error", "No se pudo eliminar la imagen", "error");
      console.error("Error deleting image:", error);
    }
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
                  style={{ display: !elementActive ? "block" : "none" ,}}
                  disabled={data ? true : false}
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
                  onChange={(e) =>
                    handleDateChange("fechaDesde", e.target.value)
                  }
                  name="fechaDesde"
                  label="Fecha Desde"
                  variant="filled"
                  InputLabelProps={{
                    style: { fontSize: '0.875rem', marginBottom: "15px" } // Cambia el tamaño de la letra
                  }}
                  InputProps={{
                    style: { fontSize: '0.875rem', marginTop: "15px" } // Cambia el tamaño de la letra del contenido del campo
                  }}
                />
                <TextField
                  type="date"
                  value={itemValue.fechaHasta}
                  onChange={(e) =>
                    handleDateChange("fechaHasta", e.target.value)
                  }
                  name="fechaHasta"
                  label="Fecha Hasta"
                  variant="filled"
                  InputLabelProps={{
                    style: { fontSize: '0.875rem', marginBottom: "15px" } // Cambia el tamaño de la letra
                  }}
                  InputProps={{
                    style: { fontSize: '0.875rem', marginTop: "15px" } // Cambia el tamaño de la letra del contenido del campo
                  }}
                />
                <TextField
                  type="time"
                  value={itemValue.horaDesde}
                  onChange={handlePropsElementsInputs}
                  name="horaDesde"
                  label="Hora Desde"
                  variant="filled"
                  InputLabelProps={{
                    style: { fontSize: '0.875rem', marginBottom: "15px" } 
                  }}
                  InputProps={{
                    style: { fontSize: '0.875rem', marginTop: "15px" } // Cambia el tamaño de la letra del contenido del campo
                  }}
                />
                <TextField
                  type="time"
                  value={itemValue.horaHasta}
                  onChange={handlePropsElementsInputs}
                  name="horaHasta"
                  label="Hora Hasta"
                  variant="filled"
                  InputLabelProps={{
                    style: { fontSize: '0.875rem', marginBottom: "15px" } // Cambia el tamaño de la letra
                  }}
                  InputProps={{
                    style: { fontSize: '0.875rem', marginTop: "15px" } // Cambia el tamaño de la letra del contenido del campo
                  }}
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
                  disabled={data ? true : false}
                >
                  <MenuItem value="HAPPY_HOUR">Happy Hour</MenuItem>
                  <MenuItem value="PROMOCION">Promoción</MenuItem>
                </Select>
              </div>
            </div>
            <div>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  marginTop: "20px",
                  display: !elementActive ? "block" : "none",
                }}
              >
                <h4>Selecciona las Sucursales</h4>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  paddingBottom: "10px",
                  fontSize: "20px",
                }}
              >
                {sucursales.map((sucursal) => (
                  <div key={sucursal.id} style={{display: "flex", alignItems: "center", marginBottom: "10px", // Add some space between items
                  }}>
                    <input
                      type="checkbox"
                      id={`sucursal-${sucursal.id}`}
                      checked={selectedSucursales.includes(sucursal.id)}
                      onChange={() => handleCheckboxChange(sucursal.id)}
                      style={{ display: !elementActive ? "block" : "none", marginRight: "10px"}}
                      disabled={data ? true : false}
                    />
                    <label
                      style={{ display: !elementActive ? "block" : "none" }}
                      htmlFor={`sucursal-${sucursal.id}`}
                    >
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
                justifyContent: "center", // Center the content
                marginBottom: "2vh",
              }}
            >
              <TextField
                style={{
                  display: !elementActive ? "block" : "none",
                  width: "20%", // Increase the width to make it a bit larger
                  maxWidth: "600px", // Add a max-width to avoid it being too large
                }}
                label="Descripcion"
                type="text"
                value={itemValue.descripcionDescuento}
                onChange={handlePropsElementsInputs}
                name="descripcionDescuento"
                variant="filled"
                multiline
                rows={4}
                disabled={data ? true : false}
              />
            </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2vh",
                  padding: ".4rem",
                }}
              >
                 {data && (
                  <div>
                  <ImageCarrousel
                    images={images} // Pass the images array as prop
                    handleDeleteImage={(publicId: string, id: number) =>
                      handleDeleteImage(publicId, id)
                    } // Pass the handleDeleteImage function as prop
                  />
                </div>
                )}
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type="file"
                  onChange={handleFileChange}
                  inputProps={{ multiple: true }}
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
                            {data ? ( // Verifica si hay datos existentes (edición)
                              <input
                                type="number"
                                value={detalle.cantidad}
                                onChange={(e) =>
                                  handleChangeCantidad(
                                    detalle.id,
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              detalle.cantidad // Si no hay datos, solo muestra la cantidad
                            )}
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
