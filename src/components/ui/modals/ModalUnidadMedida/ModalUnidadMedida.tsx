// Importación de las dependencias necesarias
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import IUnidadMedidaPost from "../../../../types/Dtos/UnidadMedidaDto/UnidadMedidaPost";
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
const API_URL = import.meta.env.VITE_API_URL;

// Interfaz para los props del componente ModalPersona
interface IModalUnidadMedida {
getUnidadMedida: Function; 
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

// Definición del componente ModalPersona
export const ModalUnidadMedida = ({
  getUnidadMedida,
  openModal,
  setOpenModal,
}: IModalUnidadMedida) => {
  // Valores iniciales para el formulario
  const initialValues: IUnidadMedidaPost = {
    id: 0,
    denominacion: "",
  };

  // URL de la API obtenida desde las variables de entorno
  //const actualDate: string = new Date().toISOString().split("T")[0];
  const unidadMedidaService = new UnidadMedidaService(API_URL + "/UnidadMedida");

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
          {/* Título del modal dependiendo de si se está editando o añadiendo una persona */}
          {elementActive ? (
            <Modal.Title>Editar Unidad de Medida:</Modal.Title>
          ) : (
            <Modal.Title>Añadir Unidad de Medida:</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {/* Componente Formik para el formulario */}
          <Formik
            validationSchema={Yup.object({
              denominacion: Yup.string().required("Campo requerido"),
            })}
            initialValues={elementActive ? elementActive : initialValues}
            enableReinitialize={true}
            onSubmit={async (values: IUnidadMedidaPost) => {
              // Enviar los datos al servidor al enviar el formulario
              if (elementActive) {
                await unidadMedidaService.put(elementActive?.id, values);
              } else {
                await unidadMedidaService.post(API_URL + "/UnidadMedida", values);
              }
              // Obtener las unidades de medida actualizadas y cerrar el modal
              getUnidadMedida();
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
                      label="Denominacion de Unidad de Medida:"
                      name="denominacion"
                      type="text"
                      placeholder="Unidad de Medida"
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
