import { Button, Modal, SelectChangeEvent } from "@mui/material";
import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import { ArticuloInsumoService } from "../../../../services/ArticuloInsumoService";
import { CategoriaService } from "../../../../services/CategoriaService";

import InsumoPost from "../../../../types/Dtos/InsumosDto/InsumoPost";
import {
  MenuItem,
  Select,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import IUnidadMedidaPost from "../../../../types/Dtos/UnidadMedidaDto/UnidadMedidaPost";
import { ICategoria } from "../../../../types/Categoria";
import { ImagenService } from "../../../../services/ImagenService";
import IImagenes from "../../../../types/Imagenes";
import { setLoading } from "../../../../redux/slices/EmpresaReducer";
import Swal from "sweetalert2";
import { ImageCarrousel } from "../../ImageCarrousel/ImageCarrousel";
import InsumoEditDto from "../../../../types/Dtos/InsumosDto/InsumoEditDto";
import { InsumoEditService } from "../../../../services/InsumoEditService";
import useAuthToken from "../../../../hooks/useAuthToken";

const API_URL = import.meta.env.VITE_API_URL;

// Interfaz para los props del componente ModalPersona
interface IModalInsumos {

  categorias: ICategoria[];
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

const initialValues: InsumoPost & { idCategoria: number } = {
  id: 0,
  denominacion: "",
  precioVenta: 0,
  idUnidadMedida: 0,
  precioCompra: 0,
  stockActual: 0,
  stockMaximo: 0,
  stockMinimo: 0,
  esParaElaborar: false,
  idCategoria: 0, 
};


export const ModalArticuloInsumo = ({

  openModal,
  categorias,
  setOpenModal,
}: IModalInsumos) => {
  const insumoService = new ArticuloInsumoService(`${API_URL}/ArticuloInsumo`);
  const insumoEditService = new InsumoEditService(`${API_URL}/ArticuloInsumo`)
  const dispatch = useAppDispatch();
  const elementActive = useAppSelector(
    (state) => state.tablaReducer.elementActive
  );
  const [unidadMedida, setUnidadMedida] = useState<IUnidadMedidaPost[]>([]);

   //Obtenemos el token para mandarlo
   const getToken = useAuthToken();

  const unidadMedidaService = new UnidadMedidaService(
    `${API_URL}/UnidadMedida`
  );

  const categoriaService = new CategoriaService(`${API_URL}/categoria`)

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
  };

  const getUnidadMedida = async () => {
    try {
      const data = await unidadMedidaService.getAll();
      setUnidadMedida(data);
    } catch (error) {
      console.error("Error al obtener unidades de medida:", error);
    }
  };

  useEffect(() => {
    if (openModal) {
      getUnidadMedida();
    }
  }, [openModal]);

  const validationSchema = Yup.object({
    denominacion: Yup.string().required("Campo requerido"),
    precioVenta: Yup.number()
      .required("Campo requerido")
      .min(0, "El precio debe ser mayor o igual a 0"),
    precioCompra: Yup.number()
      .required("Campo requerido")
      .min(0, "El precio debe ser mayor o igual a 0"),
    stockActual: Yup.number()
      .required("Campo requerido")
      .min(0, "El stock debe ser mayor o igual a 0"),
    stockMaximo: Yup.number()
      .required("Campo requerido")
      .min(0, "El stock debe ser mayor o igual a 0"),
      stockMinimo: Yup.number()
      .required("Campo requerido")
      .min(0, "El stock debe ser mayor o igual a 0"),
    idUnidadMedida: Yup.number().required("Campo requerido"),
  });

  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number>(1);

  const handleChangeCategoriaValues = async (e: SelectChangeEvent<number>) => {
    const idCategoria = e.target.value as number;
    setSelectedCategoriaId(idCategoria);
  };

   //#region  IMAGENES PRODUCTO
   const [images, setImages] = useState<IImagenes[]>([]);
   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
   const imageService = new ImagenService(API_URL + "/ArticuloInsumo");

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

  useEffect(() => {
    if (openModal && elementActive) {
      getUnidadMedida();
      getImages(elementActive.id); // Load images when editing
      console.log(elementActive);
      
    }
  }, [openModal, elementActive]);

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{ zIndex: 999 }}
    >
      <div
        style={{
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "8px",
          margin: "auto",
          marginTop: "5rem",
          maxWidth: "600px",
          overflowY: "auto",
          maxHeight: "900px"
        }}
      >
        <h2 style={{fontSize: "30px", marginBottom: "25px"}}>{elementActive ? "Editar" : "Añadir"} un Insumo</h2>
        <Formik
          initialValues={elementActive ? elementActive : initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values: InsumoPost) => {
            const token = await getToken();
            
            try {
              let insumo;

              if (elementActive) {
                try{
                  const {id, precioVenta, precioCompra, stockActual, stockMaximo, stockMinimo } = values;

                  const editedData : InsumoEditDto = {
                    id,
                    precioVenta,
                    precioCompra,
                    stockActual,
                    stockMaximo,
                    stockMinimo,
                  };
                  //await insumoEditService.put(values.id, editedData);
                  await insumoEditService.putSec(values.id, editedData, token);
                  insumo = values;
                } catch (error) {
                  console.error("Error al editar insumo:", error);
                  Swal.fire("Error", "Error al editar insumo", "error");
                  return;
                }
              } else {
                const newItemValue = { ...values, idCategoria: selectedCategoriaId };
                
                /* const response = await insumoService.post(
                  `${API_URL}/ArticuloInsumo`,
                  newItemValue
                ); */

                const response = await insumoService.postSec(
                  `${API_URL}/ArticuloInsumo`,
                  newItemValue, token
                );
                insumo = response;
                
                if (!selectedFiles || selectedFiles.length === 0) {
                  Swal.fire("No hay imágenes seleccionadas", "Selecciona al menos una imagen", "warning");
                  return; // Detener el envío del formulario si no hay imágenes seleccionadas
                }
              
              try {
                Swal.fire({
                  title: "Subiendo imágenes...",
                  text: "Espere mientras se suben los archivos.",
                  allowOutsideClick: false,
                  showConfirmButton: false, // Oculta el botón de confirmar para evitar que el usuario cierre la alerta manualmente
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });
                
                const formData = new FormData();
                  Array.from(selectedFiles).forEach((file) => {
                formData.append("uploads", file);
               });
          
               //await imageService.uploadImages(`${API_URL}/ArticuloInsumo/uploads?id=${insumo.id}`,formData);
               await imageService.uploadImagesWithSecurity(`${API_URL}/ArticuloInsumo/uploads?id=${insumo.id}`,formData, token);
               Swal.fire("Éxito", "Imágenes subidas correctamente", "success");
                //fetchImages();
              } catch (error) {
                Swal.fire("Error", "Algo falló al subir las imágenes, inténtalo de nuevo.", "error");
              } finally {
                setSelectedFiles(null);
                Swal.close();
              }


              }
        

              handleClose();
            } catch (error) {
              console.error("Error al guardar el insumo:", error);
            }
          }}
        >
          {({ handleChange, values }) => (
            <Form>
              <div
                style={{
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: "1fr 1fr",
                }}
              >
                <FormControl>
                  <TextField
                    label="Denominación"
                    name="denominacion"
                    value={values.denominacion}
                    onChange={handleChange}
                    style={{ display: !elementActive ? "block" : "none" , width: "90%" }}
                  />
                  <ErrorMessage
                    name="denominacion"
                    component={FormHelperText}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Precio Venta"
                    name="precioVenta"
                    type="number"
                    value={values.precioVenta}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="precioVenta" component={FormHelperText} />
                </FormControl>
                <FormControl>
                  <InputLabel id="categoria-label" style={{ display: !elementActive ? "block" : "none" , width: "90%" }}>Categoría</InputLabel>
                  <Select
                    labelId="categoria-label"
                    label="Categoría"
                    name="id"
                    value={selectedCategoriaId ?? ""}
                    onChange={handleChangeCategoriaValues}
                    style={{ display: !elementActive ? "block" : "none" , width: "90%" }}
                  >
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.id} value={categoria.id}>
                        {categoria.denominacion}
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorMessage name="idCategoria" component={FormHelperText} />
                </FormControl>
                <FormControl>
                  <InputLabel id="unidad-medida-label" style={{ display: !elementActive ? "block" : "none" , width: "90%" }}>
                    Unidad de Medida
                  </InputLabel>
                  <Select
                    labelId="unidad-medida-label"
                    label="Unidad de Medida"
                    name="idUnidadMedida"
                    value={values.idUnidadMedida}
                    onChange={handleChange}
                    style={{ display: !elementActive ? "block" : "none" , width: "90%" }}
                  >
                    {unidadMedida.map((unidad) => (
                      <MenuItem key={unidad.id} value={unidad.id}>
                        {unidad.denominacion}
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorMessage
                    name="idUnidadMedida"
                    component={FormHelperText}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Precio Compra"
                    name="precioCompra"
                    type="number"
                    value={values.precioCompra}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="precioCompra"
                    component={FormHelperText}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Stock Actual"
                    name="stockActual"
                    type="number"
                    value={values.stockActual}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="stockActual" component={FormHelperText} />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Stock Máximo"
                    name="stockMaximo"
                    type="number"
                    value={values.stockMaximo}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="stockMaximo" component={FormHelperText} />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Stock Mínimo"
                    name="stockMinimo"
                    type="number"
                    value={values.stockMinimo}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="stockMinimo" component={FormHelperText} />
                </FormControl>
                <FormControl>
                  <label style={{ display: !elementActive ? "block" : "none" , width: "90%" }}>
                    <Field
                      type="checkbox"
                      name="esParaElaborar"
                      as={Checkbox}
                      style={{ display: !elementActive ? "block" : "none" , width: "90%" }}
                    />
                    Es Para Elaborar?
                  </label>
                </FormControl>
                <FormControl>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2vh", padding: ".4rem" }}>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      type="file"
                      onChange={handleFileChange}
                      inputProps={{ multiple: true }}
                    />
                  </div>
                </FormControl>
                {elementActive && (
                  <ImageCarrousel
                    images={images} // Pasas las imágenes como prop al carousel
                    handleDeleteImage={(publicId: string, id: number) => handleDeleteImage(publicId, id)} // Pasas la función para eliminar imágenes como prop
                  />
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}
              >
                <Button variant="contained" color="primary" type="submit">
                  Enviar
                </Button>
                <Button variant="contained" color="error" onClick={handleClose}>
                  Cerrar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
