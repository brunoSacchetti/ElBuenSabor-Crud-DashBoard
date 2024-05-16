// Importación de las dependencias necesarias
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import IPromocion from "../../../../types/Promocion";
import { PromocionService } from "../../../../services/PromocionService";
const API_URL = import.meta.env.VITE_API_URL;

// Interfaz para los props del componente IModalPromocion
interface IModalPromocion {
  getPromocion: Function; // Función para obtener las promociones
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

// Definición del componente ModalPromocion
export const ModalPromocion = ({
  getPromocion,
  openModal,
  setOpenModal,
}: IModalPromocion) => {
  // Valores iniciales para el formulario
  const initialValues: IPromocion = {
    id: 0,
    denominacion: "",
    fechaDesde: "",
    fechaHasta: "",
    horaDesde: "",
    horaHasta: "",
    descripcionDescuento: "",
    precioPromocional:  100000,
    tipoPromocion: "",
    articulos:[] as any,
    imagenes:[] as any,
  };

  // URL de la API obtenida desde las variables de entorno
  const apiPromocion = new PromocionService(API_URL + "/promociones");

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
            <Modal.Title>Editar una Promocion:</Modal.Title>
          ) : (
            <Modal.Title>Añadir una Promocion:</Modal.Title>
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
            onSubmit={async (values: IPromocion) => {
              // Enviar los datos al servidor al enviar el formulario
              if (elementActive) {
                await apiPromocion.put(API_URL + "/promociones", values.id.toString(), values)
              } else {
                await apiPromocion.post(values);
              }
              // Obtener las personas actualizadas y cerrar el modal
              getPromocion();
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
