// Importación de las dependencias necesarias
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import IEmpresa from "../../../../types/Empresa";
import { EmpresaService } from "../../../../services/EmpresaService";
import ISucursales from "../../../../types/Sucursales";
import { SucursalService } from "../../../../services/SucursalService";
import { useEffect, useState } from "react";
import IPais from "../../../../types/Pais";
import IProvincia from "../../../../types/Provincia";
import ILocalidad from "../../../../types/Localidad";
import { CFormSelect } from "@coreui/react";
const API_URL = import.meta.env.VITE_API_URL;

// Interfaz para los props del componente ModalPersona
interface IModalSucursales {
  empresaId?: number;
  getSucursales: Function; // Función para obtener las personas
  openModal: boolean;
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
    id: 0,
    nombre: "",
    horarioApertura: "",
    horarioCierre: "",
    domicilio: {
      id: 0,
      calle: "",
      numero: 0,
      codigoPostal: 0,
      localidad: {
        id: 0,
        nombre: "",
        provincia: {
          id: 0,
          nombre: "",
          pais: {
            id: 0,
            nombre: "",
          },
        },
      },
    },
  };

  const [paises, setPaises] = useState<IPais[]>([]);
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);

  useEffect(() => {
    fetch(API_URL + "/paises")
      .then((response) => response.json())
      .then((data) => setPaises(data));
  }, []);

  const handlePaisChange = (
    paisId: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    fetch(API_URL + `/provincias?pais.id=${paisId}`)
      .then((response) => response.json())
      .then((data) => {
        setProvincias(data);
        setLocalidades([]);
        setFieldValue("domicilio.localidad.provincia", "");
        setFieldValue("domicilio.localidad", "");
      });
  };

  const handleProvinciaChange = (
    provinciaId: string,
    setFieldValue: (field: string, value: any) => void
  ) => {
    fetch(API_URL + `/localidades?provincia.id=${provinciaId}`)
      .then((response) => response.json())
      .then((data) => {
        setLocalidades(data);
        setFieldValue("domicilio.localidad", "");
      });
  };

  // URL de la API obtenida desde las variables de entorno
  const apiSucursales = new SucursalService(API_URL + "/sucursales");

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
            initialValues={elementActive ? elementActive : initialValues}
            enableReinitialize={true}
            onSubmit={async (values: ISucursales) => {
              // Enviar los datos al servidor al enviar el formulario
              if (elementActive) {
                await apiSucursales.put(
                  API_URL + "sucursales",
                  values.id.toString(),
                  values
                );
              } else {
                await apiSucursales.post(values);
              }
              // Obtener las personas actualizadas y cerrar el modal
              getSucursales();
              handleClose();
            }}
          >
            {({ setFieldValue }) => (
              <>
                {/* Formulario */}
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
                      label="Calle"
                      name="domicilio.calle"
                      type="text"
                      placeholder="Calle"
                    />
                    <TextFieldValue
                      label="Número"
                      name="domicilio.numero"
                      type="number"
                      placeholder="Número"
                    />
                    <TextFieldValue
                      label="Código Postal"
                      name="domicilio.codigoPostal"
                      type="number"
                      placeholder="Código Postal"
                    />
                  </div>

                  <div>
                    <label htmlFor="pais">País</label>
                    <CFormSelect
                      aria-label="País select example"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const paisId = e.target.value;
                        setFieldValue(
                          "domicilio.localidad.provincia.pais.id",
                          paisId
                        );
                        handlePaisChange(paisId, setFieldValue);
                      }}
                    >
                      <option value="">Seleccione un país</option>
                      {paises.map((pais) => (
                        <option key={pais.id} value={pais.id}>
                          {pais.nombre}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>

                  <div>
                    <label htmlFor="provincia">Provincia</label>
                    <CFormSelect
                      aria-label="Provincia select example"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const provinciaId = e.target.value;
                        setFieldValue(
                          "domicilio.localidad.provincia.id",
                          provinciaId
                        );
                        handleProvinciaChange(provinciaId, setFieldValue);
                      }}
                    >
                      <option value="">Seleccione una provincia</option>
                      {provincias.map((provincia) => (
                        <option key={provincia.id} value={provincia.id}>
                          {provincia.nombre}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>

                  <div>
                    <label htmlFor="localidad">Localidad</label>
                    <CFormSelect
                      aria-label="Localidad select example"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const localidadId = e.target.value;
                        const selectedLocalidad = localidades.find(
                          (localidad) => localidad.id === Number(localidadId)
                        );
                        setFieldValue("domicilio.localidad", selectedLocalidad);
                        setFieldValue("domicilio.localidad.id", localidadId);
                      }}
                    >
                      <option value="">Seleccione una localidad</option>
                      {localidades.map((localidad) => (
                        <option key={localidad.id} value={localidad.id}>
                          {localidad.nombre}
                        </option>
                      ))}
                    </CFormSelect>
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
