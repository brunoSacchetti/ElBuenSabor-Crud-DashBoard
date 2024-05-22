// Importación de las dependencias necesarias
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";

import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Field, Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";

import { ArticuloInsumoService } from "../../../../services/ArticuloInsumoService";
import InsumoPost from "../../../../types/Dtos/InsumosDto/InsumoPost";
import { Checkbox, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import IUnidadMedidaPost from "../../../../types/Dtos/UnidadMedidaDto/UnidadMedidaPost";

const API_URL = import.meta.env.VITE_API_URL;

// Interfaz para los props del componente ModalPersona
interface IModalInsumos {
  getInsumos: Function; // Función para obtener las personas
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

// Definición del componente ModalPersona
export const ModalArticuloInsumo = ({
  getInsumos,
  openModal,
  setOpenModal,
}: IModalInsumos) => {
  // Valores iniciales para el formulario
  const initialValues: InsumoPost = {
    id: 0,
    denominacion: "",
    precioVenta: 0,
    idUnidadMedida: 0,
    precioCompra: 0,
    stockActual: 0,
    stockMaximo: 0,
    esParaElaborar: false,
  };

  // URL de la API obtenida desde las variables de entorno
  const insumoService = new ArticuloInsumoService(`${API_URL}/ArticuloInsumo`);

  const elementActive = useAppSelector(
    (state) => state.tablaReducer.elementActive
  );

  const dispatch = useAppDispatch();

  // Función para cerrar el modal
  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
  };

  const [itemValue, setItemValue] = useState<InsumoPost>(initialValues);
  const [selectedUnidadMedidaId, setSelectedUnidadMedidaId] = useState<number | null>(null);
  const [unidadMedida, setUnidadMedida] = useState<IUnidadMedidaPost[]>([]);

  const unidadMedidaService = new UnidadMedidaService(`${API_URL}/UnidadMedida`);

  /* UNIDAD MEDIDA */
  const handleChangeUnidadMedidaValues = (e: SelectChangeEvent<number>) => {
    const unidadMedidaId = e.target.value as number;
    setSelectedUnidadMedidaId(unidadMedidaId);
    setItemValue({
      ...itemValue,
      idUnidadMedida: unidadMedidaId,
    });
  };

  const getUnidadMedida = async () => {
    try {
      const data = await unidadMedidaService.getAll();
      setUnidadMedida(data);
    } catch (error) {
      console.error("Error al obtener unidades de medida:", error);
    }
  };

  useEffect(() => {
    if (openModal) {
      getUnidadMedida();
    }
  }, [openModal]);

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
            <Modal.Title>Editar un Insumo:</Modal.Title>
          ) : (
            <Modal.Title>Añadir un Insumo:</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {/* Componente Formik para el formulario */}
          <Formik
            validationSchema={Yup.object({
              denominacion: Yup.string().required("Campo requerido"),
              precioVenta: Yup.number().required("Campo requerido"),
              precioCompra: Yup.number().required("Campo requerido"),
            })}
            initialValues={elementActive ? elementActive : initialValues}
            enableReinitialize={true}
            onSubmit={async (values: InsumoPost) => {
              // Enviar los datos al servidor al enviar el formulario
              if (elementActive) {
                await insumoService.put(
                  values.id,
                  values
                );
              } else {
                console.log(values);
                
                await insumoService.post(API_URL, values);
              }
              // Obtener las personas actualizadas y cerrar el modal
              getInsumos();
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
                      label="Denominación:"
                      name="denominacion"
                      type="text"
                      placeholder="Nombre Insumo"
                    />
                    <TextFieldValue
                      label="Precio Venta"
                      name="precioVenta"
                      type="number"
                      placeholder="Precio Venta"
                    />
                    <Select
                      label="Unidad de Medida"
                      value={selectedUnidadMedidaId ?? ""}
                      onChange={handleChangeUnidadMedidaValues}
                      variant="filled"
                    >
                      {unidadMedida.map((unidad) => (
                        <MenuItem key={unidad.id} value={unidad.id}>
                          {unidad.denominacion}
                        </MenuItem>
                      ))}
                    </Select>
                    <TextFieldValue
                      label="Precio Compra"
                      name="precioCompra"
                      type="number"
                      placeholder="Precio Compra"
                    />
                    <label>
                      <Field type="checkbox" name="esParaElaborar" as={Checkbox} />
                      Es Para Elaborar?
                    </label>
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