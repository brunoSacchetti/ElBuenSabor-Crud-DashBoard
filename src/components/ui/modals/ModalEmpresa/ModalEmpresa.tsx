import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import IEmpresa from "../../../../types/Empresa";
import { EmpresaService } from "../../../../services/EmpresaService";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { ImagenService } from "../../../../services/ImagenService";
import { removeEmpresaActive, setLoading } from "../../../../redux/slices/EmpresaReducer";
import useAuthToken from "../../../../hooks/useAuthToken";
import { ImageCarrousel } from "../../ImageCarrousel/ImageCarrousel";
import Swal from "sweetalert2";
import IImagenes from "../../../../types/Imagenes";

const API_URL = import.meta.env.VITE_API_URL;

// Interfaz para los props del componente ModalPersona
interface IModalEmpresa {
  getEmpresa: Function; // Función para obtener las personas
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

// Definición del componente ModalPersona
export const ModalEmpresa = ({
  getEmpresa,
  openModal,
  setOpenModal,
}: IModalEmpresa) => {
  // Valores iniciales para el formulario
  const initialValues: IEmpresa = {
    id: 0,
    eliminado: false,
    nombre: "",
    razonSocial: "",
    cuil: 0,
    sucursales: [],
  };

  // URL de la API obtenida desde las variables de entorno
  const apiEmpresa = new EmpresaService(API_URL + "/empresa");
  const imageService = new ImagenService(API_URL + "/empresa");
  const elementActive = useAppSelector((state) => state.empresa.empresaActual);
  const dispatch = useAppDispatch();

  //Obtenemos el token para mandarlo
  const getToken = useAuthToken();

  // Función para cerrar el modal
  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeEmpresaActive());
  };

  // State para almacenar los archivos seleccionados
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [images, setImages] = useState<IImagenes[]>([]);

  // Función para manejar el cambio en los archivos seleccionados
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  // Función para subir las imágenes seleccionadas
  const uploadImages = async (files: FileList, idEmpresa: number, token: string) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("uploads", files[i]);
      }
      formData.append("id", String(idEmpresa)); // Adjuntar el ID de la empresa
      
      // Enviar las imágenes al backend
      await imageService.uploadImagesWithSecurity(`${API_URL}/empresa/uploads?id=${idEmpresa}`,formData, token);
      console.log("Imágenes subidas correctamente.");
    } catch (error) {
      console.error("Error al subir imágenes:", error);
    }
  };

  useEffect(() => {
    if (!openModal) {
      dispatch(removeEmpresaActive());
    }
  }, [openModal, dispatch]);
  
  useEffect(() => {
    if (elementActive && openModal) {

      getImages(elementActive.id);
    }
  }, [elementActive, openModal]);
  
  const getImages = async (id: number) => {
    try {
      dispatch(setLoading(true));
      const data = await imageService.getImagesByEmpresaId(id);
      console.log(data);
      
      setImages(data);
    } catch (error) {
      Swal.fire("Error", "Error al obtener las imágenes", "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteImage = async (publicId: string, id: number) => {
    try {
      
      // Realiza la llamada al servicio para eliminar la imagen
      await imageService.deleteImageEmpresa(publicId, id);
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
      {/* Componente Modal de React Bootstrap */}
      <Modal
        id={"modal"}
        show={openModal}
        onHide={handleClose}
        size={"lg"}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          {/* Título del modal dependiendo de si se está editando o añadiendo una persona */}
          {elementActive ? (
            <Modal.Title>Editar una empresa:</Modal.Title>
          ) : (
            <Modal.Title>Añadir una empresa:</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {/* Componente Formik para el formulario */}
          <Formik
            validationSchema={Yup.object({
              cuil: Yup.string()
                    .matches(/^[0-9]+$/, 'CUIL inválido. Solo se permiten números.')
                    .matches(/^\d{11}$/, 'CUIL inválido. Debe tener 11 dígitos.')
                    .required("Campo requerido"),
              nombre: Yup.string().required("Campo requerido"),
              razonSocial: Yup.string().required("Campo requerido"),
            })}
            initialValues={elementActive ? elementActive : initialValues}
            enableReinitialize={true}
            onSubmit={async (values: IEmpresa) => {
                
              const token = await getToken();

              try {
                let idEmpresa;
                // Enviar los datos de la empresa al servidor
                if (elementActive) {
                  //await apiEmpresa.put(values.id, values);
                  await apiEmpresa.putSec(values.id, values, token);
                  idEmpresa = values.id;
                  
                  if (selectedFiles) {
                    await uploadImages(selectedFiles, idEmpresa, token);
                  }

                } else {
                  //const response = await apiEmpresa.post(API_URL + "/empresa", values);
                  const response = await apiEmpresa.postSec(API_URL + "/empresa", values, token);
                  idEmpresa = response.id; // Obtener el ID de la empresa creada
                  // Subir las imágenes seleccionadas
                  if (selectedFiles) {
                    await uploadImages(selectedFiles, idEmpresa, token);
                  }
                }
                // Obtener las empresas actualizadas y cerrar el modal
                getEmpresa();
                handleClose();
                
              } catch (error) {
                console.error("Error al enviar datos al servidor:", error);
              }
            }}
          >
            {() => (
              <>
                {/* Formulario */}
                <Form autoComplete="off" className="form-obraAlta">
                  <div className="container_Form_Ingredientes">
                    {/* Campos del formulario */}
                    
                    {elementActive && (
                      <div>
                      <ImageCarrousel
                        images={images} 
                        handleDeleteImage={(publicId: string, id: number) =>
                          handleDeleteImage(publicId, id)
                        } 
                      />
                    </div>
                    
                    )}
                    <TextFieldValue
                        label="Empresa:"
                        name="nombre"
                        type="text"
                        placeholder="Nombre Empresa"
                      />
                    <TextFieldValue
                      label="Razon Social:"
                      name="razonSocial"
                      type="text"
                      placeholder="Razon Social"
                    />
                    <TextFieldValue
                      label="CUIL:"
                      name="cuil"
                      type="text"
                      placeholder="Cuil"
                    />
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <label htmlFor="file">Seleccionar una imagen</label>
                    <TextField
                    
                      id="outlined-basic"
                      variant="outlined"
                      type="file"
                      onChange={handleFileChange}
                      inputProps={{
                        multiple: true,
                      }}
                    />
                    </div>
                  </div>
                  {/* Botón para enviar el formulario */}
                  <div className="d-flex justify-content-end">
                    <Button variant="success" type="submit">
                      Enviar
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};
