// Importación de las dependencias necesarias
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
import { removeEmpresaActive } from "../../../../redux/slices/EmpresaReducer";
import useAuthToken from "../../../../hooks/useAuthToken";

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
  const imagenService = new ImagenService(API_URL + "/empresa");
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
      await imagenService.uploadImagesWithSecurity(`http://localhost:8080/empresa/uploads?id=${idEmpresa}`,formData, token);
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
