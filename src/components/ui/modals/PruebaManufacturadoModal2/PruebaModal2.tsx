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
import { InsumosModal } from "./InsumosModal"; // Importamos el modal secundario
import { TablePruebaModal2 } from "../../TablePruebaModal2/TablePruebaModal2";
import IArticuloInsumo from "../../../../types/ArticuloInsumo";
import { UnidadMedidaGetService } from "../../../../services/UnidadMedidaGetService";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { Table } from "react-bootstrap";
import { SucursalService } from "../../../../services/SucursalService";
import { ImagenService } from "../../../../services/ImagenService";
import IImagenes from "../../../../types/Imagenes";
import { setLoading } from "../../../../redux/slices/EmpresaReducer";
import { ProductoPostService } from "../../../../services/ProductoPostService";
import ProductoDetallePost from "../../../../types/post/ProductoDetallePost";
import { ImageCarrousel } from "../../ImageCarrousel/ImageCarrousel";

const API_URL = import.meta.env.VITE_API_URL;

const initialValues: ProductoPost = {
  id: 0,
  denominacion: "",
  descripcion: "",
  tiempoEstimadoMinutos: 10,
  precioVenta: 100,
  preparacion: "",
  idUnidadMedida: 1,
  //idsArticuloManufacturadoDetalles: [],
  detalles: [ //articuloManufacturadoDetalles
    {
      cantidad: 0,
      idArticuloInsumo: 0,
    },
  ],
  idCategoria: 1,
  //imagenes: [],
};

interface IMasterDetailModal {
  open: boolean;
  getData: () => void;
  handleClose: () => void;
}

export const PruebaModal2: FC<IMasterDetailModal> = ({
  handleClose,
  open,
  getData,
}) => {
  const [itemValue, setItemValue] = useState<ProductoPost>(initialValues);
  const [selectedUnidadMedidaId, setSelectedUnidadMedidaId] =
    useState<number>();
  const [selectedDetalle, setSelectedDetalle] = useState<any[]>([]);
  const [unidadMedida, setUnidadMedida] = useState<IUnidadMedida[]>([]);
  const [categoria, setCategoria] = useState<ICategoria[]>([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number>(1);
  const [openInsumosModal, setOpenInsumosModal] = useState<boolean>(false);
  const [dataIngredients, setDataIngredients] = useState<any[]>([]);

  const [openImageModal, setOpenImageModal] = useState<boolean>(false);

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
  const sucursalService = new SucursalService(`${API_URL}/sucursal`);

  //obtenemos la sucursal actual
 

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

  /* const getCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  }; */

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
      const response = await fetch(`${API_URL}/ArticuloManufacturado/allDetalles/${productoId}`);
      if (!response.ok) {
        throw new Error("Error al obtener los detalles de los insumos");
      }
      const detallesData = await response.json();
      // Formatear los detalles obtenidos para que coincidan con la estructura esperada
      const formattedDetalles = detallesData.map((detalle: any) => ({
        id: detalle.id, // Asegúrate de que cada detalle tenga un id definido
        cantidad: detalle.cantidad,
        denominacion: detalle.articuloInsumo.denominacion,
        idArticuloInsumo: detalle.articuloInsumo.id,
      }));
      setSelectedDetalle(formattedDetalles);
    } catch (error) {
      console.error("Error al obtener los detalles de los insumos:", error);
    }
  };

  useEffect(() => {
    if (data) {
      const productoData: ProductoPost = data as ProductoPost;
      setItemValue({
        id: productoData.id,
        denominacion: productoData.denominacion,
        precioVenta: productoData.precioVenta,
        tiempoEstimadoMinutos: productoData.tiempoEstimadoMinutos,
        descripcion: productoData.descripcion,
        preparacion: productoData.preparacion,
        /* idsArticuloManufacturadoDetalles:
          productoData.idsArticuloManufacturadoDetalles, */
        detalles: productoData.detalles,
        idUnidadMedida: productoData.idUnidadMedida,
        idCategoria: productoData.idCategoria,
      });
      setSelectedUnidadMedidaId(productoData.idUnidadMedida);
      setSelectedCategoriaId(productoData.idCategoria); 

      // Fetch and set the insumos related to the product
      getProductoDetalles(productoData.id); // Esta función se encargará de realizar la llamada a la API y actualizar los detalles de los insumos
      getImages(productoData.id); // Esta función se encarga de traer las imagenes del producto
    } else {
      resetValues();
    }
  }, [data]);

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

  const handlePropsElementsInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setItemValue({
      ...itemValue,
      [name]: value,
    });
  };
  console.log(itemValue);

  /* const handleConfirmModal = async () => {
    try {
      let productoId: number;
      let detallesIds: number[] = [];

      if (data) {
        await productoManufacturadoService.put(itemValue.id, itemValue);
        productoId = itemValue.id;
      } else {
        const newProducto = await productoManufacturadoService.postOnlyData(itemValue);
        productoId = newProducto.id;
      }

      await categoriaService.addArticuloManufacturado(selectedCategoriaId, productoId);

      await Promise.all(
        selectedDetalle.map(async (detalle) => {
          const newDetalle = {
            id: 0,
            cantidad: detalle.cantidad,
            idArticuloInsumo: detalle.id,
            idArticuloManufacturado: productoId,
          };
          const createdDetalle = await productoDetalleService.postOnlyData(newDetalle);
          detallesIds.push(createdDetalle.id);
        })
      );

      await productoManufacturadoService.put(productoId, {
        ...itemValue,
        idsArticuloManufacturadoDetalles: detallesIds,
      });

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
  }; */

  /* const handleConfirmModal = async () => {
    try {
      // Verifica si hay al menos un detalle agregado
      if (selectedDetalle.length === 0) {
        // Muestra un mensaje de error con SweetAlert
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Debes agregar al menos un detalle antes de confirmar.',
        });
        return;
      }

      let productoId: number;
      let detallesIds: number[] = [];

      if (data) {
        await productoManufacturadoService.put(itemValue.id, itemValue);
        productoId = itemValue.id;
      } else {
        const newProducto = await productoManufacturadoService.postOnlyData(itemValue);
        productoId = newProducto.id;
      }

      await categoriaService.addArticuloManufacturado(selectedCategoriaId, productoId);

      await Promise.all(
        selectedDetalle.map(async (detalle) => {
          const newDetalle = {
            id: 0,
            cantidad: detalle.cantidad,
            idArticuloInsumo: detalle.id,
            idArticuloManufacturado: productoId,
          };
          const createdDetalle = await productoDetalleService.postOnlyData(newDetalle);
          detallesIds.push(createdDetalle.id);
        })
      );

      await productoManufacturadoService.put(productoId, {
        ...itemValue,
        idsArticuloManufacturadoDetalles: detallesIds,
      });

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
  }; */

   //#region  IMAGENES PRODUCTO
   const [images, setImages] = useState<IImagenes[]>([]);
   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
   const imageService = new ImagenService(API_URL + "/ArticuloManufacturado");
   
  const handleConfirmModal = async () => {
    try {
      // Verifica si hay al menos un detalle agregado
      if (selectedDetalle.length === 0) {
        // Muestra un mensaje de error con SweetAlert
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debes agregar al menos un detalle antes de confirmar.",
        });
        return;
      }

      let productoId;

      // Verifica que todos los campos obligatorios estén completos
      if (
        itemValue.denominacion.trim() === "" ||
        itemValue.descripcion.trim() === "" ||
        itemValue.preparacion.trim() === "" ||
        itemValue.precioVenta === 0 ||
        itemValue.tiempoEstimadoMinutos === 0 ||
        selectedUnidadMedidaId === 0 ||
        selectedCategoriaId === 0
      ) {
        // Muestra un mensaje de error con SweetAlert
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Por favor completa todos los campos obligatorios antes de confirmar.",
        });
        return;
      }

      console.log(selectedDetalle);

      if (data) {
        // Si hay datos, se trata de una edición, entonces realizamos la solicitud PUT
  
        console.log(selectedDetalle);
  
        const productoEditado = {
          id: itemValue.id,
          descripcion: itemValue.descripcion,
          preparacion: itemValue.preparacion,
          precioVenta: itemValue.precioVenta,
          tiempoEstimadoMinutos: itemValue.tiempoEstimadoMinutos,
          detalles: selectedDetalle.map((detalle) => ({
            cantidad: detalle.cantidad,
            idArticuloInsumo: detalle.idArticuloInsumo || detalle.id // Ajusta esto según la estructura de tu objeto detalle
          }))
        }

        /* const updatedItemValue = {
          ...itemValue,
          articuloManufacturadoDetalles: selectedDetalle.map((detalle) => ({
            cantidad: detalle.cantidad,
            idArticuloInsumo: detalle.id // Ajusta esto según la estructura de tu objeto detalle
          }))
        }; */

        console.log("PRODUCTO EDITADO", productoEditado);
        
  
        const productoPutService = new ProductoPostService(`${API_URL}/ArticuloManufacturado`);
  
        // Realizar el put del producto con los detalles asignados
        await productoPutService.put(itemValue.id, productoEditado as ProductoPost);

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
            await imageService.uploadImages(`${API_URL}/ArticuloManufacturado/uploads?id=${itemValue.id}`,formData);
            Swal.fire("Éxito", "Imágenes subidas correctamente", "success");
            //fetchImages();
          } catch (error) {
            Swal.fire("Error", "Algo falló al subir las imágenes, inténtalo de nuevo.", "error");
          } finally {
            setSelectedFiles(null);
            Swal.close();
          }
        }
      
      } else {
        
        const updatedItemValue = {
          ...itemValue,
          articuloManufacturadoDetalles: selectedDetalle.map((detalle) => ({
            cantidad: detalle.cantidad,
            idArticuloInsumo: detalle.id // Ajusta esto según la estructura de tu objeto detalle
          }))
        };
        
        const productoPostService = new ProductoPostService(`${API_URL}/ArticuloManufacturado`);
      
        // Realiza el post del producto con los detalles asignados
        const newProducto = await productoPostService.postOnlyData(updatedItemValue);
        
        productoId = newProducto.id;
      
        console.log(productoId);
        
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
            await imageService.uploadImages(`${API_URL}/ArticuloManufacturado/uploads?id=${productoId}`, formData);
            Swal.fire("Éxito", "Imágenes subidas correctamente", "success");
            //fetchImages();
          } catch (error) {
            Swal.fire("Error", "Algo falló al subir las imágenes, inténtalo de nuevo.", "error");
          } finally {
            setSelectedFiles(null);
            Swal.close();
          }
        }
      }
      
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

  const handleChangeCantidad = (detalleId: number, cantidad: string) => {
    // Convierte la cantidad a un número entero
    const nuevaCantidad = parseInt(cantidad);
    
    // Verifica si el detalle ya existe en los detalles seleccionados
    const detalleExistenteIndex = selectedDetalle.findIndex(detalle => detalle.id === detalleId);
  
    if (detalleExistenteIndex !== -1) {
      // Si el detalle existe, actualiza la cantidad
      const updatedDetalles = [...selectedDetalle]; // Crea una copia del arreglo de detalles
      updatedDetalles[detalleExistenteIndex] = { ...updatedDetalles[detalleExistenteIndex], cantidad: nuevaCantidad }; // Actualiza la cantidad del detalle existente
      setSelectedDetalle(updatedDetalles); // Establece el estado con los nuevos detalles
    } else {
      // Si el detalle no existe, agrega un nuevo detalle con la cantidad especificada
      const nuevoDetalle = {
        id: detalleId,
        cantidad: nuevaCantidad
      };
  
      // Agrega el nuevo detalle a los detalles seleccionados
      const updatedDetalles = [...selectedDetalle, nuevoDetalle];
  
      // Actualiza el estado con los nuevos detalles
      setSelectedDetalle(updatedDetalles);
    }
    console.log(selectedDetalle);
  };
  
  

  const handleTableIngredientSelect = (selectedData: any) => {
    const filteredData = selectedData.map((item: any) => ({
      id: item.id,
      cantidad: item.cantidad,
      denominacion: item.denominacion,
    }));
    setSelectedDetalle(filteredData);
  };

  const handleChangeUnidadMedidaValues = async (
    e: SelectChangeEvent<number>
  ) => {
    const unidadMedidaId = e.target.value as number;
    setSelectedUnidadMedidaId(unidadMedidaId);
    setItemValue({
      ...itemValue,
      idUnidadMedida: unidadMedidaId,
    });
  };

  /* const handleChangeCategoriaValues = async (e: SelectChangeEvent<number>) => {
    const categoriaId = e.target.value as number;
    setSelectedCategoriaId(categoriaId);
  }; */

  const handleChangeCategoriaValues = async (e: SelectChangeEvent<number>) => {
    const categoriaId = e.target.value as number;
    setSelectedCategoriaId(categoriaId);
    setItemValue({
      ...itemValue,
      idCategoria: categoriaId,
    });
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
    console.log(updatedDetalle);
    setSelectedDetalle(updatedDetalle);
  };

 

  /* useEffect(() => {
    if (productoData.id) {
      fetchImages();
    }
  }, [elementActive.id]);

  const fetchImages = async () => {
    try {
      const data = await imageService.getImagesByArticuloId(elementActive.id);
      setImages(data);
    } catch (error) {
      Swal.fire("Error", "Error al obtener las imágenes", "error");
    } 
  }; */

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
      await imageService.deleteImage(publicId, id);
      // Actualiza la lista de imágenes en el estado local eliminando la imagen eliminada
      setImages(images.filter(image => image.id !== id));
      // Muestra un mensaje de éxito si la eliminación fue exitosa
      Swal.fire('Imagen eliminada', 'La imagen se eliminó correctamente', 'success');
      // Aquí podrías actualizar la lista de imágenes en tu estado o recargar las imágenes del producto
    } catch (error) {
      // Muestra un mensaje de error si la eliminación falla
      Swal.fire('Error', 'No se pudo eliminar la imagen', 'error');
      console.error('Error deleting image:', error);
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
          {data && (
              <div>
                <ImageCarrousel
                  images={images} // Pass the images array as prop
                  handleDeleteImage={(publicId: string, id: number) => handleDeleteImage(publicId, id)} // Pass the handleDeleteImage function as prop
                />
              </div>
          )}
            <div style={{ textAlign: "center" }}>
              <h1>{data ? "Editar" : "Crear"} un producto manufacturado</h1>
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
                  disabled={data ? true : false}
                />
                <TextField
                  type="number"
                  value={itemValue.precioVenta}
                  onChange={handlePropsElementsInputs}
                  name="precioVenta"
                  label="Precio"
                  variant="filled"
                  defaultValue={0}
                />
                <TextField
                  type="number"
                  onChange={handlePropsElementsInputs}
                  name="tiempoEstimadoMinutos"
                  value={itemValue.tiempoEstimadoMinutos}
                  label="Tiempo estimado de preparacion"
                  variant="filled"
                  defaultValue={0}
                />
                <TextField
                  onChange={handlePropsElementsInputs}
                  label="Descripción"
                  type="text"
                  value={itemValue.descripcion}
                  name="descripcion"
                  variant="filled"
                  multiline
                  rows={4}
                />
              </div>
              <h1>Unidad De Medida</h1>
              <Select
                label="Unidad de Medida"
                value={selectedUnidadMedidaId ?? ""}
                onChange={handleChangeUnidadMedidaValues}
                variant="filled"
                disabled={data ? true : false}
              >
                {unidadMedida.map((unidad) => (
                  <MenuItem key={unidad.id} value={unidad.id}>
                    {unidad.denominacion}
                  </MenuItem>
                ))}
              </Select>
              <h1>Categoria</h1>
              <Select
                label="Categoria"
                value={selectedCategoriaId ?? ""}
                onChange={handleChangeCategoriaValues}
                variant="filled"
                disabled={data ? true : false}
              >
                {categoria.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.denominacion}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div>
              <div style={{ textAlign: "center" }}>
                <h1>Ingresa la preparacion</h1>
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
                  label="Receta"
                  type="text"
                  value={itemValue.preparacion}
                  onChange={handlePropsElementsInputs}
                  name="preparacion"
                  variant="filled"
                  multiline
                  rows={4}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2vh", padding: ".4rem" }}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  type="file"
                  onChange={handleFileChange}
                  inputProps={{ multiple: true }}
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

            {/* <div className={styles.ingredientesTableContainer}>
              {selectedDetalle.length > 0 ? (
                <div className={styles.ingredientesTableContainerItem}>
                  {selectedDetalle.map((detalle) => (
                    <div key={detalle.id} className={styles.ingredientItem}>
                      <span className={styles.ingredientName}>
                        {detalle.denominacion}
                      </span>
                      <span className={styles.ingredientQuantity}>
                        {detalle.cantidad}
                      </span>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleRemoveInsumo(detalle.id)}
                      >
                        Quitar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No hay insumos agregados</div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                <Button variant="contained" color="error" onClick={handleClose}>
                  Cerrar Modal
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleConfirmModal}
                >
                  Confirmar
                </Button>
              </div>
            </div> */}
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
                    onChange={(e) => handleChangeCantidad(detalle.id, e.target.value)}
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
    <div>No hay insumos agregados</div>
  )}
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleClose}
                >
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
      <InsumosModal
        open={openInsumosModal}
        handleClose={handleCloseInsumosModal}
        handleAddInsumos={handleAddInsumos} // Cambiar 'onConfirm' a 'handleAddInsumos'
      />
      <div>
    </div>
    </div>
  );
};
