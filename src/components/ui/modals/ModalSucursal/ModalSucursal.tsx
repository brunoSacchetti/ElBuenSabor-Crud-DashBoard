// Importación de las dependencias necesarias
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { useAppDispatch, useAppSelector} from "../../../../hooks/redux";

import ISucursales from "../../../../types/Sucursales";
import { useEffect, useState } from "react";
import IPais from "../../../../types/Pais";
import IProvincia from "../../../../types/Provincia";
import ILocalidad from "../../../../types/Localidad";
import { CFormSelect } from "@coreui/react";
import { SucursalService } from "../../../../services/SucursalService";
import { removeElementActive, setDataTable } from "../../../../redux/slices/TablaReducer";
import { setLoading } from "../../../../redux/slices/EmpresaReducer";
import { EmpresaService } from "../../../../services/EmpresaService";

const API_URL = import.meta.env.VITE_API_URL;

interface IModalSucursales {
  openModal: boolean;
  empresaId?: number;
  setOpenModal: (state: boolean) => void;
  getSucursales: () => void;
}

export const ModalSucursal: React.FC<IModalSucursales> = ({ empresaId, getSucursales, openModal, setOpenModal }) => {
  
  const [paises, setPaises] = useState<IPais[]>([]);
  const [provincias, setProvincias] = useState<IProvincia[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]);

  const elementActive = useAppSelector(
    (state) => state.tablaReducer.elementActive
  );
  const dispatch = useAppDispatch();

  const apiSucursales = new SucursalService(API_URL);

  const empresaService = new EmpresaService(API_URL + `/empresas`
  )

  useEffect(() => {
    fetch(API_URL + '/paises').then(response => response.json()).then(data => setPaises(data));
  }, []);

  const handlePaisChange = (paisId: string, setFieldValue: (field: string, value: any) => void) => {
    fetch(API_URL + `/provincias?pais.id=${paisId}`)
      .then(response => response.json())
      .then(data => {
        setProvincias(data);
        setLocalidades([]);
        setFieldValue('domicilio.localidad.provincia', '');
        setFieldValue('domicilio.localidad', '');
      });
  };

  const handleProvinciaChange = (provinciaId: string, setFieldValue: (field: string, value: any) => void) => {
    fetch(API_URL + `/localidades?provincia.id=${provinciaId}`)
      .then(response => response.json())
      .then(data => {
        setLocalidades(data);
        setFieldValue('domicilio.localidad', '');
      });
  };

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
  };

  const getSucursalesEmpresa = async () => {
    if (typeof empresaId === 'number') { // Asegúrate de que empresaId no es undefined
        await empresaService.getById(empresaId).then((empresaData) => {
            const empresaSeleccionada = empresaData;
            const sucursalesEmpresa = empresaSeleccionada ? empresaSeleccionada.sucursales : [];
            dispatch(setDataTable(sucursalesEmpresa));
            dispatch(setLoading(false));
        }).catch(err => {
            console.error("Error fetching data: ", err);
            dispatch(setLoading(false));
        });
    } else {
        console.error("Empresa ID is undefined");
        dispatch(setLoading(false));
    }
};

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
            nombre: ""
          }
        }
      }
    }
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("Campo requerido"),
    horarioApertura: Yup.string().required("Campo requerido"),
    horarioCierre: Yup.string().required("Campo requerido"),
    domicilio: Yup.object({
      calle: Yup.string().required("Campo requerido"),
      numero: Yup.number().required("Campo requerido"),
      codigoPostal: Yup.number().required("Campo requerido"),
      localidad: Yup.object({
        nombre: Yup.string().required("Campo requerido"),
        provincia: Yup.object({
          nombre: Yup.string().required("Campo requerido"),
          pais: Yup.object({
            nombre: Yup.string().required("Campo requerido"),
          })
        })
      })
    })
  });

  return (
    <Modal show={openModal} onHide={() => setOpenModal(false)} size="lg" backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{initialValues.id ? 'Editar Sucursal' : 'Añadir Sucursal'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values: ISucursales) => {
            // Enviar los datos al servidor al enviar el formulario
            if (elementActive) {
              await apiSucursales.put(API_URL + `/${empresaId}/sucursales`, values.id.toString(), values)
            } else {
              await apiSucursales.post(values);
            }
            // Obtener las sucursales actualizadas y cerrar el modal
            getSucursalesEmpresa();
            handleClose();
          }}
          enableReinitialize
        >
          {({ setFieldValue }) => (
            <Form>
              <TextFieldValue label="Nombre" name="nombre" type="text" placeholder="Nombre de la Sucursal" />
              <TextFieldValue label="Horario de Apertura" name="horarioApertura" type="time" placeholder="Horario de apertura" />
              <TextFieldValue label="Horario de Cierre" name="horarioCierre" type="time" placeholder="Horario de cierre" />
              <TextFieldValue label="Calle" name="domicilio.calle" type="text" placeholder="Calle" />
              <TextFieldValue label="Número" name="domicilio.numero" type="number" placeholder="Número" />
              <TextFieldValue label="Código Postal" name="domicilio.codigoPostal" type="number" placeholder="Código Postal" />

              <div>
                <label htmlFor="pais">País</label>
                <CFormSelect aria-label="País select example" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const paisId = e.target.value;
                  setFieldValue('domicilio.localidad.provincia.pais.id', paisId);
                  handlePaisChange(paisId, setFieldValue);
                }}>
                  <option value="">Seleccione un país</option>
                  {paises.map(pais => (
                    <option key={pais.id} value={pais.id}>{pais.nombre}</option>
                  ))}
                </CFormSelect>
              </div>

              <div>
                <label htmlFor="provincia">Provincia</label>
                <CFormSelect aria-label="Provincia select example" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const provinciaId = e.target.value;
                  setFieldValue('domicilio.localidad.provincia.id', provinciaId);
                  handleProvinciaChange(provinciaId, setFieldValue);
                }}>
                  <option value="">Seleccione una provincia</option>
                  {provincias.map(provincia => (
                    <option key={provincia.id} value={provincia.id}>{provincia.nombre}</option>
                  ))}
                </CFormSelect>
              </div>

              <div>
                <label htmlFor="localidad">Localidad</label>
                <CFormSelect aria-label="Localidad select example" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFieldValue('domicilio.localidad.id', e.target.value)}>
                  <option value="">Seleccione una localidad</option>
                  {localidades.map(localidad => (
                    <option key={localidad.id} value={localidad.id}>{localidad.nombre}</option>
                  ))}
                </CFormSelect>
              </div>

              <Button variant="success" type="submit">Guardar</Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};