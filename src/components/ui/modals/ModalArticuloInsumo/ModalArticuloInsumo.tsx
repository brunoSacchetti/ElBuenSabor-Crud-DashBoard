import { Button, Modal, SelectChangeEvent } from "@mui/material";
import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import { ArticuloInsumoService } from "../../../../services/ArticuloInsumoService";
import { CategoriaService } from "../../../../services/CategoriaService";

import InsumoPost from "../../../../types/Dtos/InsumosDto/InsumoPost";
import {
  MenuItem,
  Select,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import IUnidadMedidaPost from "../../../../types/Dtos/UnidadMedidaDto/UnidadMedidaPost";
import { ICategoria } from "../../../../types/Categoria";

const API_URL = import.meta.env.VITE_API_URL;

// Interfaz para los props del componente ModalPersona
interface IModalInsumos {
  getInsumos: () => void; // Función para obtener las personas
  categorias: ICategoria[];
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

const initialValues: InsumoPost & { categoriaId: number } = {
  id: 0,
  denominacion: "",
  precioVenta: 0,
  idUnidadMedida: 3,
  precioCompra: 0,
  stockActual: 0,
  stockMaximo: 0,
  stockMinimo: 0,
  esParaElaborar: false,
  categoriaId: 0, // Nuevo campo para el id de la categoría
};
export const ModalArticuloInsumo = ({
  getInsumos,
  openModal,
  categorias,
  setOpenModal,
}: IModalInsumos) => {
  const insumoService = new ArticuloInsumoService(`${API_URL}/ArticuloInsumo`);
  const dispatch = useAppDispatch();
  const elementActive = useAppSelector(
    (state) => state.tablaReducer.elementActive
  );
  const [unidadMedida, setUnidadMedida] = useState<IUnidadMedidaPost[]>([]);

  const unidadMedidaService = new UnidadMedidaService(
    `${API_URL}/UnidadMedida`
  );

  const categoriaService = new CategoriaService(`${API_URL}/categoria`)

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
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

  const validationSchema = Yup.object({
    denominacion: Yup.string().required("Campo requerido"),
    precioVenta: Yup.number()
      .required("Campo requerido")
      .min(0, "El precio debe ser mayor o igual a 0"),
    precioCompra: Yup.number()
      .required("Campo requerido")
      .min(0, "El precio debe ser mayor o igual a 0"),
    stockActual: Yup.number()
      .required("Campo requerido")
      .min(0, "El stock debe ser mayor o igual a 0"),
    stockMaximo: Yup.number()
      .required("Campo requerido")
      .min(0, "El stock debe ser mayor o igual a 0"),
      stockMinimo: Yup.number()
      .required("Campo requerido")
      .min(0, "El stock debe ser mayor o igual a 0"),
    idUnidadMedida: Yup.number().required("Campo requerido"),
  });

  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number>(1);
  const handleChangeCategoriaValues = async (e: SelectChangeEvent<number>) => {
    const categoriaId = e.target.value as number;
    setSelectedCategoriaId(categoriaId);
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div
        style={{
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "8px",
          margin: "auto",
          marginTop: "5rem",
          maxWidth: "600px",
        }}
      >
        <h2>{elementActive ? "Editar" : "Añadir"} un Insumo</h2>
        <Formik
          initialValues={elementActive ? elementActive : initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={async (values: InsumoPost) => {
            try {
              let insumo;
              if (elementActive) {
                await insumoService.put(values.id, values);
                insumo = values;
              } else {
                const response = await insumoService.post(
                  "http://localhost:8080/ArticuloInsumo",
                  values
                );
                insumo = response; 
              }
        
              await categoriaService.addInsumoToCategoria(selectedCategoriaId, insumo.id);
              getInsumos();
              handleClose();
            } catch (error) {
              console.error("Error al guardar el insumo:", error);
            }
          }}
        >
          {({ handleChange, values }) => (
            <Form>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <FormControl>
                  <TextField
                    label="Denominación"
                    name="denominacion"
                    value={values.denominacion}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="denominacion"
                    component={FormHelperText}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Precio Venta"
                    name="precioVenta"
                    type="number"
                    value={values.precioVenta}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="precioVenta" component={FormHelperText} />
                </FormControl>
                <FormControl>
                  <InputLabel id="categoria-label">Categoría</InputLabel>
                  <Select
                    labelId="categoria-label"
                    label="Categoría"
                    name="id"
                    value={selectedCategoriaId ?? ""}
                    onChange={handleChangeCategoriaValues}
                  >
                    {categorias.map((categoria) => (
                      <MenuItem key={categoria.id} value={categoria.id}>
                        {categoria.denominacion}
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorMessage name="categoriaId" component={FormHelperText} />
                </FormControl>
                <FormControl>
                  <InputLabel id="unidad-medida-label">
                    Unidad de Medida
                  </InputLabel>
                  <Select
                    labelId="unidad-medida-label"
                    label="Unidad de Medida"
                    name="idUnidadMedida"
                    value={values.idUnidadMedida}
                    onChange={handleChange}
                  >
                    {unidadMedida.map((unidad) => (
                      <MenuItem key={unidad.id} value={unidad.id}>
                        {unidad.denominacion}
                      </MenuItem>
                    ))}
                  </Select>
                  <ErrorMessage
                    name="idUnidadMedida"
                    component={FormHelperText}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Precio Compra"
                    name="precioCompra"
                    type="number"
                    value={values.precioCompra}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="precioCompra"
                    component={FormHelperText}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Stock Actual"
                    name="stockActual"
                    type="number"
                    value={values.stockActual}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="stockActual" component={FormHelperText} />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Stock Máximo"
                    name="stockMaximo"
                    type="number"
                    value={values.stockMaximo}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="stockMaximo" component={FormHelperText} />
                </FormControl>
                <FormControl>
                  <TextField
                    label="Stock Mínimo"
                    name="stockMinimo"
                    type="number"
                    value={values.stockMinimo}
                    onChange={handleChange}
                  />
                  <ErrorMessage name="stockMinimo" component={FormHelperText} />
                </FormControl>
                <FormControl>
                  <label>
                    <Field
                      type="checkbox"
                      name="esParaElaborar"
                      as={Checkbox}
                    />
                    Es Para Elaborar?
                  </label>
                </FormControl>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}
              >
                <Button variant="contained" color="primary" type="submit">
                  Enviar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
