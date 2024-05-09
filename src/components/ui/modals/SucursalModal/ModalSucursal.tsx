// Importación de las dependencias necesarias
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";

import ISucursales from "../../../../types/Sucursales";
import { SucursalService } from "../../../../services/SucursalService";

const API_URL = import.meta.env.VITE_API_URL;

// Interfaz para los props del componente ModalPersona
interface IModalSucursales {
  getSucursales: Function; // Función para obtener las personas
  openModal: boolean;
  empresaId:string,
  setOpenModal: (state: boolean) => void;
}

// Definición del componente ModalPersona
export const ModalSucursal = ({
  empresaId,
  getSucursales,
  openModal,
  setOpenModal,
}: IModalSucursales) => {
  // Valores iniciales para el formulario
  const initialValues: ISucursales = {
    id:0,
    nombre:"",
    horarioApertura:"",
    horarioCierre:"",
    domicilio:"" as any
  };

  // URL de la API obtenida desde las variables de entorno
  const apiSucursales = new SucursalService(API_URL + `/empresas/${empresaId}/sucursales`);

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
            <Modal.Title>Editar una Sucursal:</Modal.Title>
          ) : (
            <Modal.Title>Añadir una Sucursal:</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {/* Componente Formik para el formulario */}
          <Formik
            validationSchema={Yup.object({
              nombre: Yup.string().required("Campo requerido"),
              horarioApertura: Yup.string().required("Campo requerido"),
              horarioCierre: Yup.string().required("Campo requerido"),
              
            })}
            initialValues={elementActive ? elementActive : initialValues}
            enableReinitialize={true}
            onSubmit={async (values: ISucursales) => {
              // Enviar los datos al servidor al enviar el formulario
              if (elementActive) {
                await apiSucursales.put(API_URL + `/empresas/${empresaId}/sucursales`, values.id.toString(), values)
              } else {
                await apiSucursales.post(values);
              }
              // Obtener las personas actualizadas y cerrar el modal
              getSucursales();
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
                      placeholder="Nombre de la Sucursal"
                    />
                    <TextFieldValue
                      label="Horario de Apertura"
                      name="horarioApertura"
                      type="date"
                      placeholder="Horario de apertura"
                    />
                    <TextFieldValue
                      label="Horario de Cierre"
                      name="horarioCierre"
                      type="date"
                      placeholder="Horario de cierre"
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
