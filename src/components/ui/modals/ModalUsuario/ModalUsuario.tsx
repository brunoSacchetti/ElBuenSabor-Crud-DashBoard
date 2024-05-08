// Importación de las dependencias necesarias
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import IUsuarios from "../../../../types/Usuarios";
import { UsuariosService } from "../../../../services/UsuariosService";
const API_URL = import.meta.env.VITE_API_URL;

// Interfaz para los props del componente ModalPersona
interface IModalUsuarios {
  getUsuario: Function; // Función para obtener las personas
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

// Definición del componente ModalPersona
export const ModalUsuario = ({
  getUsuario,
  openModal,
  setOpenModal,
}: IModalUsuarios) => {
  // Valores iniciales para el formulario
  const initialValues: IUsuarios = {
    id: 0,
    nombre:"",
    auth0Id:""	
  };

  // URL de la API obtenida desde las variables de entorno
  const apiUsuarios = new UsuariosService(API_URL + "/usuarios");

  const elementActive = useAppSelector(
    (state) => state.tablaReducer.elementActive
  );
  const dispatch = useAppDispatch();

  // Función para cerrar el modal
  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
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
          {/* Título del modal dependiendo de si se está editando o añadiendo un Producto */}
          {elementActive ? (
            <Modal.Title>Editar un Usuario:</Modal.Title>
          ) : (
            <Modal.Title>Añadir una Usuario:</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {/* Componente Formik para el formulario */}
          <Formik
            validationSchema={Yup.object({
              nombre: Yup.string().required("Campo requerido"),
              
            })}
            initialValues={elementActive ? elementActive : initialValues}
            enableReinitialize={true}
            onSubmit={async (values: IUsuarios) => {
              // Enviar los datos al servidor al enviar el formulario
              if (elementActive) {
                await apiUsuarios.put(API_URL + "usuarios", values.id.toString(), values)
              } else {
                await apiUsuarios.post(values);
              }
              // Obtener las personas actualizadas y cerrar el modal
              getUsuario();
              handleClose();
            }}
          >
            {() => (
              <>
                {/* Formulario */}
                <Form autoComplete="off" className="form-obraAlta">
                  <div className="container_Form_Ingredientes">
                    {/* Campos del formulario */}
                    <TextFieldValue
                      label="Nombre"
                      name="nombre"
                      type="text"
                      placeholder="Nombre del Usuario"
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
