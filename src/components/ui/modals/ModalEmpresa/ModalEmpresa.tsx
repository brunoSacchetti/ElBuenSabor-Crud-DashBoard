// Importación de las dependencias necesarias
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import IEmpresa from "../../../../types/Empresa";
import { EmpresaService } from "../../../../services/EmpresaService";
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
    nombre: "",
    razonSocial: "",
    cuil: "" as any,
    sucursales: []
  };

  // URL de la API obtenida desde las variables de entorno
  const apiEmpresa = new EmpresaService(API_URL + "/empresas");

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
            <Modal.Title>Editar una empresa:</Modal.Title>
          ) : (
            <Modal.Title>Añadir una empresa:</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {/* Componente Formik para el formulario */}
          <Formik
            validationSchema={Yup.object({
              cuil: Yup.string().required("Campo requerido"),
              nombre: Yup.string().required("Campo requerido"),
              razonSocial: Yup.string().required("Campo requerido"),
            })}
            initialValues={elementActive ? elementActive : initialValues}
            enableReinitialize={true}
            onSubmit={async (values: IEmpresa) => {
              // Enviar los datos al servidor al enviar el formulario
              if (elementActive) {
                await apiEmpresa.put(API_URL + "empresas", values.id.toString(), values)
              } else {
                await apiEmpresa.post(values);
              }
              // Obtener las personas actualizadas y cerrar el modal
              getEmpresa();
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
                    <TextFieldValue
                      label="Sucursales"
                      name="sucursales"
                      type="text"
                      placeholder=""
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
