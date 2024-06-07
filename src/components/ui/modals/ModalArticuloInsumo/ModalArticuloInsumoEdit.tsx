import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { useAppDispatch } from "../../../../hooks/redux";
import { removeEmpresaActive } from "../../../../redux/slices/EmpresaReducer";
import { ICategoria } from "../../../../types/Categoria";
import InsumoEditDto from "../../../../types/Dtos/InsumosDto/InsumoEditDto";
import { InsumoEditService } from "../../../../services/InsumoEditService";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

interface IModalInsumosEdit {
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
  articuloInsumo?: InsumoEditDto; // Permitir undefined
}

export const ModalArticuloInsumoEdit = ({
  openModal,
  setOpenModal,
  articuloInsumo,
}: IModalInsumosEdit) => {
  const initialValues = articuloInsumo || {
    id: 0,
    precioVenta: 0,
    precioCompra: 0,
    stockActual: 0,
    stockMaximo: 0,
    stockMinimo: 0,
  };

  const insumoEditService = new InsumoEditService(`${API_URL}/ArticuloInsumo`);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeEmpresaActive());
  };

  useEffect(() => {
    if (!openModal) {
      dispatch(removeEmpresaActive());
    }
  }, [openModal, dispatch]);

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
          <Modal.Title>Editar una empresa:</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={Yup.object({
              precioVenta: Yup.number().required("Campo requerido"),
              precioCompra: Yup.number().required("Campo requerido"),
              stockActual: Yup.number().required("Campo requerido"),
              stockMaximo: Yup.number().required("Campo requerido"),
              stockMinimo: Yup.number().required("Campo requerido"),
            })}
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={async (values: InsumoEditDto) => {
              await insumoEditService.put(values.id, values);
              handleClose();
            }}
          >
            {() => (
              <>
                <Form autoComplete="off" className="form-obraAlta">
                  <div className="container_Form_Ingredientes">
                    <TextFieldValue
                      label="Precio de Venta:"
                      name="precioVenta"
                      type="number"
                      placeholder="Precio de Venta"
                    />
                    <TextFieldValue
                      label="Precio de Compra:"
                      name="precioCompra"
                      type="number"
                      placeholder="Precio de Compra"
                    />
                    <TextFieldValue
                      label="Stock Actual:"
                      name="stockActual"
                      type="number"
                      placeholder="Stock Actual"
                    />
                    <TextFieldValue
                      label="Stock Máximo:"
                      name="stockMaximo"
                      type="number"
                      placeholder="Stock Máximo"
                    />
                    <TextFieldValue
                      label="Stock Mínimo:"
                      name="stockMinimo"
                      type="number"
                      placeholder="Stock Mínimo"
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
