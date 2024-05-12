import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import ISucursales from "../../../../types/Sucursales";
import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { SucursalService } from "../../../../services/SucursalService"; 
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";

const API_URL = import.meta.env.VITE_API_URL;

interface IModalSucursales {
  openModal: boolean;
  empresa: any;
  setOpenModal: (state: boolean) => void;
  getSucursales: Function;
}

export const ModalPrueba = ({
  empresa,
  getSucursales,
  openModal,
  setOpenModal,
}: IModalSucursales) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
  };

  return (
    <div>
      <Modal
        id={"modal"}
        show={openModal}
        onHide={handleClose}
        size={"lg"}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Añadir una sucursal a {empresa.nombre}:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={Yup.object({
              nombre: Yup.string().required("Campo requerido"),
              horarioApertura: Yup.string().required("Campo requerido"),
              horarioCierre: Yup.string().required("Campo requerido"),
              domicilio: Yup.object().shape({
                calle: Yup.string().required("Campo requerido"),
                numero: Yup.number().required("Campo requerido"),
                localidad: Yup.object().shape({
                  nombre: Yup.string().required("Campo requerido"),
                  provincia: Yup.object().shape({
                    nombre: Yup.string().required("Campo requerido"),
                    pais: Yup.object().shape({
                      nombre: Yup.string().required("Campo requerido"),
                    }),
                  }),
                }),
              }),
            })}
            initialValues={{
              id:0,
              nombre: "",
              horarioApertura: "",
              horarioCierre: "",
              domicilio: {
                id:0,
                calle: "",
                codigoPostal:0,
                numero: 0, 
                localidad: {
                  id:0,
                  nombre: "",
                  provincia: {
                    id:0,
                    nombre: "",
                    pais: {
                      id:0,
                      nombre: "",
                    },
                  },
                },
              },
            }}
            onSubmit={async (values: ISucursales) => {
              try {
                // Construir la URL para la solicitud POST
                const url = `${API_URL}/empresas/${empresa.id}/sucursales`; 

                // Enviar la solicitud al servidor
                const response = await fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
                });

                if (!response.ok) {
                  throw new Error("Error al procesar la solicitud");
                }

                // Actualizar la lista de sucursales después de la operación exitosa
                getSucursales();
                handleClose();
              } catch (error) {
                console.error("Error:", error);
              }
            }}
          >
            {() => (
              <>
                <Form autoComplete="off" className="form-sucursal">
                  <div className="container-form-sucursal">
                    <TextFieldValue
                      label="Nombre:"
                      name="nombre"
                      type="text"
                      placeholder="Nombre"
                    />
                    <TextFieldValue
                      label="Horario de apertura:"
                      name="horarioApertura"
                      type="text"
                      placeholder="Horario de apertura"
                    />
                    <TextFieldValue
                      label="Horario de cierre:"
                      name="horarioCierre"
                      type="text"
                      placeholder="Horario de cierre"
                    />
                    <TextFieldValue
                      label="Calle:"
                      name="domicilio.calle"
                      type="text"
                      placeholder="Calle"
                    />
                    <TextFieldValue
                      label="Número:"
                      name="domicilio.numero"
                      type="text"
                      placeholder="Número"
                    />
                    <TextFieldValue
                      label="Localidad:"
                      name="domicilio.localidad.nombre"
                      type="text"
                      placeholder="Localidad"
                    />
                    <TextFieldValue
                      label="Provincia:"
                      name="domicilio.localidad.provincia.nombre"
                      type="text"
                      placeholder="Provincia"
                    />
                    <TextFieldValue
                      label="País:"
                      name="domicilio.localidad.provincia.pais.nombre"
                      type="text"
                      placeholder="País"
                    />
                  </div>
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

/*  onSubmit={async (values: ISucursales) => {
            
            // Enviar los datos al servidor al enviar el formulario
            if (elementActive) {
              await apiSucursales.put(
                API_URL + `/empresa/${empresaId}/sucursales`,
                values.id.toString(),
                values
              );
            } else {
              await apiSucursales.post(values);
            }

            getSucursales();
            handleClose();
          }}
          
        > */