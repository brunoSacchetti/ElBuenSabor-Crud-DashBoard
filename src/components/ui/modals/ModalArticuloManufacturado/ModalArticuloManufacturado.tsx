// Importación de las dependencias necesarias
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import IArticuloManufacturado from "../../../../types/ArticuloManufacturado";
import { ArticuloManufacturadoService } from "../../../../services/ArticuloManufacturadoService";
const API_URL = import.meta.env.VITE_API_URL;

// Interfaz para los props del componente ModalPersona
interface IModalArticuloManufacturado {
  getArticuloManufacturado: Function; // Función para obtener las personas
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

// Definición del componente ModalPersona
export const ModalArticuloManufacturado = ({
  getArticuloManufacturado,
  openModal,
  setOpenModal,
}: IModalArticuloManufacturado) => {
  // Valores iniciales para el formulario
  const initialValues: IArticuloManufacturado = {
    id: 0,
    denominacion: "",
    precioVenta: 0,
    imagenes:[],
    unidadMedida:"" as any,
    descripcion: "",
    tiempoEstimadoMinutos: 0,
    preparacion:"",
    articuloManufacturadoDetalles:[],	
  };

  // URL de la API obtenida desde las variables de entorno
  const apiArticuloManufacturado = new ArticuloManufacturadoService(API_URL + "/articulosManufacturados");

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
            <Modal.Title>Editar un Producto:</Modal.Title>
          ) : (
            <Modal.Title>Añadir una Producto:</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {/* Componente Formik para el formulario */}
          <Formik
            validationSchema={Yup.object({
              denominacion: Yup.string().required("Campo requerido"),
              precioVenta: Yup.string().required("Campo requerido"),
              descripcion: Yup.string().required("Campo requerido"),
              tiempoEstimadoMinutos: Yup.string().required("Campo requerido"),
            })}
            initialValues={elementActive ? elementActive : initialValues}
            enableReinitialize={true}
            onSubmit={async (values: IArticuloManufacturado) => {
              // Enviar los datos al servidor al enviar el formulario
              if (elementActive) {
                await apiArticuloManufacturado.put(API_URL + "articulosManufacturados", values.id.toString(), values)
              } else {
                await apiArticuloManufacturado.post(values);
              }
              // Obtener las personas actualizadas y cerrar el modal
              getArticuloManufacturado();
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
                      label="Denominacion"
                      name="denominacion"
                      type="text"
                      placeholder="Nombre del Producto"
                    />
                    <TextFieldValue
                      label="Precio De Venta"
                      name="precioVenta"
                      type="number"
                      placeholder="$12000"
                    />

                    <TextFieldValue
                      label="Descripcion del Producto"
                      name="descripcion"
                      type="text"
                      placeholder="Descripcion"
                    />
                    <TextFieldValue
                      label="Tiempo Estimado"
                      name="tiempoEstimadoMinutos"
                      type="number"
                      placeholder="Tiempo Estimado del Producto"
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
