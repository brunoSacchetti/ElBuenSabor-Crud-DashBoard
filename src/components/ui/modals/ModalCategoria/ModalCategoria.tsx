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

const API_URL = import.meta.env.VITE_API_URL;

interface IModalCategoria {
  getCategorias: Function;
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
  isAddingSubcategoria: boolean; // nueva prop para determinar si es una subcategoría
  setIsAddingSubcategoria: (state: boolean) => void;
}

export const ModalCategoria = ({
  getCategorias,
  openModal,
  isAddingSubcategoria, // recibe la nueva prop
  setIsAddingSubcategoria, 
  setOpenModal,
}: IModalCategoria) => {
  const initialValues: CategoriaPost = {
    id: 0,
    eliminado: false,
    denominacion: "",
    esInsumo: false,
    idSucursales: [],
    parentId: null
  };
  
  
  const apiCategoria = new CategoriaPostService(API_URL + "/categoria");
  

  const categoriaActual = useAppSelector(
    (state) => state.categoria.categoriaActual
  );

  const sucursales = useAppSelector((state) => state.sucursal.data);
  //console.log(sucursales);
  
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);
  //console.log(sucursalActual);
  

  // Guardamos las sucursales seleccionadas
  const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeCategoriaActive());
    setIsAddingSubcategoria(false);
  };

  /* const handleCheckboxChange = (sucursalId: number) => {
    // Toggle checkbox
    setSelectedSucursales((prevSelected) =>
      prevSelected.includes(sucursalId)
        ? prevSelected.filter((id) => id !== sucursalId)
        : [...prevSelected, sucursalId]
    );
    console.log(selectedSucursales);
    
  }; */

  const handleCheckboxChange = (sucursalId: number) => {
    // Toggle checkbox
    setSelectedSucursales(prevSelected => {
      if (prevSelected.includes(sucursalId)) {
        // Si la sucursal ya estaba seleccionada, la quitamos del arreglo
        return prevSelected.filter(id => id !== sucursalId);
      } else {
        // Si la sucursal no estaba seleccionada, la agregamos al arreglo
        return [...prevSelected, sucursalId];
      }
    });
  };
  
  /* console.log(selectedSucursales); */
const parentId =useAppSelector((state) => state.categoria.categoriaPadreId)

   
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
          {categoriaActual ? (
            <Modal.Title>Editar una Categoria:</Modal.Title>
          ) : (
            <Modal.Title>{isAddingSubcategoria ? "Añadir una Subcategoría:" : "Añadir una Categoria:"}</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={Yup.object({
              denominacion: Yup.string().required("Campo requerido"),
              esInsumo: Yup.boolean().required("Campo requerido"),
            })}
            initialValues={categoriaActual ? categoriaActual : initialValues}
            enableReinitialize={true}
            onSubmit={async (values: CategoriaPost) => {
              try {
                let idCategoria;
              
                values.idSucursales = selectedSucursales;
              
                if (categoriaActual) {
                  await apiCategoria.put(values.id, values);
                  idCategoria = values.id;
                } else {
                  if (isAddingSubcategoria) {
                    // Solo agregamos como subcategoría si es una subcategoría
                    await apiCategoria.addSubCategoria(parentId, values);
                  } else {
                    // Resto del código para agregar una categoría principal
                    const response = await apiCategoria.post(`${API_URL}/categoria`, values);
                    idCategoria = response.id;
                  }
                }
              
                getCategorias();
                handleClose();
              } catch (error) {
                console.error("Error al enviar datos al servidor:", error);
              }
            }}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form autoComplete="off" className="form-obraAlta">
                <div className="container_Form_Ingredientes">
                  <TextFieldValue
                    label="Denominacion:"
                    name="denominacion"
                    type="text"
                    placeholder="Denominacion de Categoria"
                  />
                  <BootstrapForm.Check
                    label="¿Es Insumo?"
                    name="esInsumo"
                    checked={values.esInsumo}
                    onChange={(e) =>
                      setFieldValue("esInsumo", e.target.checked)
                    }
                  />
                  {!isAddingSubcategoria && (
                    <BootstrapForm.Group>
                      <BootstrapForm.Label>¿A que Sucursal desea añadir la categoria?</BootstrapForm.Label>
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
                  )}
                </div>

                <div className="d-flex justify-content-end">
                  <Button variant="success" type="submit">
                    Enviar
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