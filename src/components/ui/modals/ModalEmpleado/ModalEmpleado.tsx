// Importación de las dependencias necesarias
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import IEmpleadoPost from "../../../../types/Empleado";
import { EmpleadoService } from "../../../../services/EmpleadoService";
import { TextField } from "@mui/material";
const API_URL = import.meta.env.VITE_API_URL;

// Interfaz para los props del componente ModalPersona
interface IModalEmpleado {
  getEmpleados: Function;
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}
// Definición del componente ModalPersona
export const ModalEmpleado = ({
  getEmpleados,
  openModal,
  setOpenModal,
}: IModalEmpleado) => {
  // Valores iniciales para el formulario
  const initialValues: IEmpleadoPost = {
    id: 0,
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    rol: "",
    fechaNacimiento: "",
    idSucursal: 0,
  };

  const empleadoService = new EmpleadoService(API_URL + "/empleado");

  const elementActive = useAppSelector(
    (state) => state.tablaReducer.elementActive
  );

  const sucursalActual = useAppSelector(
    (state) => state.sucursal.sucursalActual
  );
  const dispatch = useAppDispatch();

  // Función para cerrar el modal
  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
  };
  const data = useAppSelector((state) => state.tablaReducer.elementActive);
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
            <Modal.Title>Editar un Empleado:</Modal.Title>
          ) : (
            <Modal.Title>Añadir un Empleado:</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {/* Componente Formik para el formulario */}
          <Formik
            validationSchema={Yup.object({
              nombre: Yup.string().required("Campo requerido"),
              apellido: Yup.string().required("Campo requerido"),
              tipoEmpleado: Yup.string().required("Campo requerido"),
              email: Yup.string().required("Campo requerido"),
            })}
            initialValues={elementActive ? elementActive : initialValues}
            enableReinitialize={true}
            onSubmit={async (values: IEmpleadoPost) => {
              // Enviar los datos al servidor al enviar el formulario

              
              
              if (elementActive) {
                
                const updatedValues:any = {
                  tipoEmpleado: values.rol
                };

                await empleadoService.put(values.id, updatedValues);
              } else {
                if (!sucursalActual) {
                  console.error(
                    "Error al obtener categorias: sucursalActual es null"
                  );
                  return;
                }
                let newValues = { ...values, idSucursal: sucursalActual.id };
                console.log(newValues);

                await empleadoService.post(API_URL + "/empleado", newValues);
              }
              // Obtener las unidades de medida actualizadas y cerrar el modal
              getEmpleados();
              handleClose();
            }}
          >
            {() => (
              <>
                {/* Formulario */}
                <Form autoComplete="off" className="form-obraAlta">
                  <div className="container_Form_Ingredientes">
                    {/* Campos del formulario */}
                    <div
                      style={{
                        display: data ? "none" : "block",
                        marginBottom: "1rem",
                      }}
                    >
                      <label htmlFor="nombre">Nombre:</label>
                      <TextField
                        name="nombre"
                        type="text"
                        placeholder="Nombre"
                        disabled={data ? true : false}
                      />
                    </div>
                    <div
                      style={{
                        display: data ? "none" : "block",
                        marginBottom: "1rem",
                      }}
                    >
                      <label htmlFor="apellido">Apellido:</label>
                      <TextField
                        name="apellido"
                        type="text"
                        placeholder="Apellido"
                        disabled={data ? true : false}
                      />
                    </div>
                    <div
                      style={{
                        display: data ? "none" : "block",
                        marginBottom: "1rem",
                      }}
                    >
                      <label htmlFor="telefono">Teléfono:</label>
                      <TextField
                        name="telefono"
                        type="text"
                        placeholder="Teléfono"
                        disabled={data ? true : false}
                      />
                    </div>
                    <div
                      style={{
                        display: data ? "none" : "block",
                        marginBottom: "1rem",
                      }}
                    >
                      <label htmlFor="email">Correo Electrónico:</label>
                      <TextField
                        name="email"
                        type="email"
                        placeholder="Correo Electrónico"
                        disabled={data ? true : false}
                      />
                    </div>
                    {/* Selector de roles siempre visible */}
                    <div style={{ marginBottom: "1rem" }}>
                      <label htmlFor="rol">Tipo de Empleado:</label>
                      <Field as="select" name="rol" id="rol">
                        <option value="">Selecciona un tipo</option>
                        <option value="ADMIN">Admin</option>
                        <option value="CLIENTE">Cliente</option>
                        <option value="COCINERO">Cocinero</option>
                        <option value="CAJERO">Cajero</option>
                      </Field>
                      <ErrorMessage
                        name="rol"
                        component="div"
                        className="error"
                      />
                    </div>
                    {/* Campo de fecha de nacimiento */}
                    <div
                      style={{
                        marginBottom: "1rem",
                        display: data ? "none" : "block",
                      }}
                    >
                      <label htmlFor="fechaNacimiento">
                        Fecha de Nacimiento:
                      </label>
                      <TextField
                        name="fechaNacimiento"
                        type="date"
                        placeholder="Fecha de Nacimiento"
                        disabled={data ? true : false}
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
