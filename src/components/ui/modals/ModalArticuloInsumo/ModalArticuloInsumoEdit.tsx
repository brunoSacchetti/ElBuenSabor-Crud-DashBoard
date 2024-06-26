import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import TextFieldValue from "../../TextFildValue/TextFildValue";
import { Form, Formik } from "formik";
import { useAppDispatch } from "../../../../hooks/redux";
import { setLoading } from "../../../../redux/slices/EmpresaReducer";
import InsumoEditDto from "../../../../types/Dtos/InsumosDto/InsumoEditDto";
import { InsumoEditService } from "../../../../services/InsumoEditService";
import { useEffect, useState } from "react";
import { ImageCarrousel } from "../../ImageCarrousel/ImageCarrousel";
import { ImagenService } from "../../../../services/ImagenService";
import IImagenes from "../../../../types/Imagenes";
import Swal from "sweetalert2";
import useAuthToken from "../../../../hooks/useAuthToken";
import { TextField } from "@mui/material";


const API_URL = import.meta.env.VITE_API_URL;

interface IModalInsumosEdit {
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
  articuloInsumo?: InsumoEditDto;
  getInsumosCategoria: () => void;
}

export const ModalArticuloInsumoEdit = ({
  openModal,
  setOpenModal,
  articuloInsumo,
  getInsumosCategoria,
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

  //Obtenemos el token para mandarlo
  const getToken = useAuthToken();

  const dispatch = useAppDispatch();

  const handleClose = () => {
    setOpenModal(false);
    getInsumosCategoria()
  };

  useEffect(() => {
    if (!openModal) {
      
    }
  }, [openModal, dispatch]);

  // Imágenes
  const [images, setImages] = useState<IImagenes[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const imageService = new ImagenService(`${API_URL}/ArticuloInsumo`);
  

  const fetchImages = async (id: number) => {
    try {
      dispatch(setLoading(true));
      const data = await imageService.getImagesByArticuloId(id);
      setImages(data);
    } catch (error) {
      Swal.fire("Error", "Error al obtener las imágenes", "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (articuloInsumo) {
      fetchImages(articuloInsumo.id);
    }
  }, [articuloInsumo]);



  const handleDeleteImage = async (publicId: string, id: number) => {
    try {
      await imageService.deleteImage(publicId, id);
      setImages(images.filter((image) => image.id !== id));
      Swal.fire("Imagen eliminada", "La imagen se eliminó correctamente", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la imagen", "error");
    }
  };


  const uploadImages = async (files: FileList, idInsumo: number, token: string) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("uploads", files[i]);
      }
      formData.append("id", String(idInsumo));
      
      // Enviar las imágenes al backend
      await imageService.uploadImagesWithSecurity(`${API_URL}/ArticuloInsumo/uploads?id=${idInsumo}`,formData, token);
      console.log("Imágenes subidas correctamente.");
    } catch (error) {
      console.error("Error al subir imágenes:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  return (
    <div>
      <Modal
        id="modal"
        show={openModal}
        onHide={handleClose}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar un Insumo:</Modal.Title>
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
            enableReinitialize
            onSubmit={async (values: InsumoEditDto) => {
              const token = await getToken();

              await insumoEditService.putSec(values.id, values, token);

              if (selectedFiles) {
                await uploadImages(selectedFiles, values.id, token);
              }


              handleClose();
            }}
          >
            {() => (
              <Form autoComplete="off" className="form-obraAlta">
                <div className="container_Form_Ingredientes">
                  <div>
                    <ImageCarrousel 
                      images={images}
                      handleDeleteImage={(publicId: string, id: number) => handleDeleteImage(publicId, id)}
                    />
                  </div>
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
                  <div style={{display:'flex',flexDirection:'column'}}>
                      <label htmlFor="file">Seleccionar una imagen</label>
                    <TextField
                    
                      id="outlined-basic"
                      variant="outlined"
                      type="file"
                      onChange={handleFileChange}
                      inputProps={{
                        multiple: true,
                      }}
                    />
                    </div>
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
