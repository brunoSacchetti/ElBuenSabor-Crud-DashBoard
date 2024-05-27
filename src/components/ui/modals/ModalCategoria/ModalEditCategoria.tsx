import { Button, Modal, Form as BootstrapForm } from "react-bootstrap";
import * as Yup from "yup";
import { FieldArray, Form, Formik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeCategoriaActive } from "../../../../redux/slices/CategoriaReducer";
import { CategoriaPost } from "../../../../types/Dtos/CategoriaDto/CateogoriaPost";
import { CategoriaService } from "../../../../services/CategoriaService";
import TextFieldValue from "../../TextFildValue/TextFildValue";
import { CategoriaPostService } from "../../../../services/CategoriaPostService/CategoriaPostService";
import { useState } from "react";
import { ICategoria } from "../../../../types/Categoria";

const API_URL = import.meta.env.VITE_API_URL;

interface IModalEditCategoria {
    getCategorias: Function;
    openEditModal: boolean;
    setOpenEditModal: (state: boolean) => void;
    categoriaEdit: ICategoria | null; // La categoría que se está editando
  }
  

export const ModalEditCategoria = ({
    getCategorias,
    openEditModal,
    setOpenEditModal,
    categoriaEdit,
  }: IModalEditCategoria) => {
    const initialValues: CategoriaPost = {
      id: categoriaEdit ? categoriaEdit.id : 0,
      eliminado: false,
      denominacion: categoriaEdit ? categoriaEdit.denominacion : "",
      esInsumo: categoriaEdit ? categoriaEdit.esInsumo : false,
      idSucursales: categoriaEdit ? categoriaEdit.idSucursales : [],
    };
  
    const apiCategoria = new CategoriaPostService(
      API_URL + "/categoria"
    );
  
    const sucursales = useAppSelector((state) => state.sucursal.data);
    const [selectedSucursales, setSelectedSucursales] = useState<number[]>(
      initialValues.idSucursales || []
    );
    const dispatch = useAppDispatch();
  
    const handleClose = () => {
      setOpenEditModal(false);
      dispatch(removeCategoriaActive());
    };
  
    const handleCheckboxChange = (sucursalId: number) => {
      setSelectedSucursales((prevSelected) =>
        prevSelected.includes(sucursalId)
          ? prevSelected.filter((id) => id !== sucursalId)
          : [...prevSelected, sucursalId]
      );
    };
  
    return (
      <div>
        <Modal
          id={"modalEdit"}
          show={openEditModal}
          onHide={handleClose}
          size={"lg"}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Editar Categoría</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              validationSchema={Yup.object({
                denominacion: Yup.string().required("Campo requerido"),
                esInsumo: Yup.boolean().required("Campo requerido"),
              })}
              initialValues={initialValues}
              enableReinitialize={true}
              onSubmit={async (values: CategoriaPost) => {
                try {
                  // Agregar los IDs de las sucursales seleccionadas al objeto values
                  values.idSucursales = selectedSucursales;
  
                  await apiCategoria.put(values.id, values);
  
                  getCategorias();
                  handleClose();
                } catch (error) {
                  console.error("Error al enviar datos al servidor:", error);
                }
              }}
            >
              {({ values, setFieldValue }) => (
                <Form autoComplete="off" className="form-obraAlta">
                  <div className="container_Form_Ingredientes">
                    <TextFieldValue
                      label="Denominación:"
                      name="denominacion"
                      type="text"
                      placeholder="Denominación de Categoría"
                    />
                    <BootstrapForm.Check
                      label="¿Es Insumo?"
                      name="esInsumo"
                      checked={values.esInsumo}
                      onChange={(e) =>
                        setFieldValue("esInsumo", e.target.checked)
                      }
                    />
                    <BootstrapForm.Group>
                      <BootstrapForm.Label>
                        ¿A qué sucursales deseas añadir la categoría?
                      </BootstrapForm.Label>
                      {sucursales.map((sucursal) => (
                        <BootstrapForm.Check
                          key={sucursal.id}
                          type="checkbox"
                          id={`sucursal-${sucursal.id}`}
                          label={sucursal.nombre}
                          checked={selectedSucursales.includes(sucursal.id)}
                          onChange={() => handleCheckboxChange(sucursal.id)}
                        />
                      ))}
                    </BootstrapForm.Group>
                  </div>
  
                  <div className="d-flex justify-content-end">
                    <Button variant="success" type="submit">
                      Guardar
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </div>
    );
  };
  