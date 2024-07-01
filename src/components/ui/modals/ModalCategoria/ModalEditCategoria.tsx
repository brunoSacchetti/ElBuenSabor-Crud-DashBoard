import { Button, Modal} from "react-bootstrap";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useAppDispatch } from "../../../../hooks/redux";
import { removeCategoriaActive } from "../../../../redux/slices/CategoriaReducer";

import TextFieldValue from "../../TextFildValue/TextFildValue";
import { CategoriaPostService } from "../../../../services/CategoriaPostService/CategoriaPostService";

import { ICategoria } from "../../../../types/Categoria";
import { CategoriaEdit } from "../../../../types/Dtos/CategoriaDto/CategoriaEdit";

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
  const initialValues: CategoriaEdit = {
    id: categoriaEdit ? categoriaEdit.id : 0,
    eliminado: false,
    denominacion: categoriaEdit ? categoriaEdit.denominacion : ""
  };

  
    const apiCategoria = new CategoriaPostService(
      API_URL + "/categoria"
    );
    const dispatch = useAppDispatch();
  
    const handleClose = () => {
      setOpenEditModal(false);
      dispatch(removeCategoriaActive());
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
                denominacion: Yup.string().required("Campo requerido")
              })}
              initialValues={initialValues}
              enableReinitialize={true}
              onSubmit={async (values: CategoriaEdit) => {
                try {
                  await apiCategoria.put(values.id, values);
  
                  getCategorias();
                  handleClose();
                } catch (error) {
                  console.error("Error al enviar datos al servidor:", error);
                }
              }}
            >
              {() => (
                <Form autoComplete="off" className="form-obraAlta">
                  <div className="container_Form_Ingredientes">
                    <TextFieldValue
                      label="Denominación:"
                      name="denominacion"
                      type="text"
                      placeholder="Denominación de Categoría"
                    />
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
  