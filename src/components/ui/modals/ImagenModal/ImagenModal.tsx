import { useEffect, useState } from "react";

import IImagen from "../../../../types/IImagen";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { ImagenService } from "../../../../services/ImagenService";
import IImagenes from "../../../../types/Imagenes";

// URL de la API obtenida desde las variables de entorno
const URL_API = import.meta.env.VITE_API_URL;
const imageService = new ImagenService(URL_API);

interface ImageModalProps {
  open: boolean;
  handleClose: () => void;
  articleId: number;
}

export const ImageModal = ({ open, handleClose, articleId }: ImageModalProps) => {
 const [images, setImages] = useState<IImagenes[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (articleId) {
      fetchImages();
    }
  }, [articleId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await imageService.getImagesByArticuloId(articleId);
      setImages(data);
    } catch (error) {
      Swal.fire("Error", "Error al obtener las imágenes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const uploadFiles = async () => {
    if (!selectedFiles) {
      return Swal.fire("No hay imágenes seleccionadas", "Selecciona al menos una imagen", "warning");
    }

    try {
      Swal.fire({
        title: "Subiendo imágenes...",
        text: "Espere mientras se suben los archivos.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
        Array.from(selectedFiles).forEach((file) => {
      formData.append("uploads", file);
     });

      await imageService.uploadImages(`${URL_API}`, formData);
      Swal.fire("Éxito", "Imágenes subidas correctamente", "success");
      fetchImages();
    } catch (error) {
      Swal.fire("Error", "Algo falló al subir las imágenes, inténtalo de nuevo.", "error");
    } finally {
      setSelectedFiles(null);
      Swal.close();
    }
  };

  const handleDeleteImg = async (uuid: string, url: string) => {
    const regex = /\/([0-9a-f]{32})/;
    const match = url.match(regex);

    if (match) {
      const publicId = match[1];

      Swal.fire({
        title: "Eliminando imagen...",
        text: "Espere mientras se elimina la imagen.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await imageService.delete(publicId, articleId);
        Swal.fire("Éxito", "Imagen eliminada correctamente", "success");
        fetchImages();
      } catch (error) {
        Swal.fire("Error", "Algo falló al eliminar la imagen, inténtalo de nuevo.", "error");
      } finally {
        Swal.close();
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Gestionar Imágenes</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2vh", padding: ".4rem" }}>
          <TextField
            id="outlined-basic"
            variant="outlined"
            type="file"
            onChange={handleFileChange}
            inputProps={{ multiple: true }}
          />
          <Button variant="contained" onClick={uploadFiles}>
            Subir Imágenes
          </Button>
        </div>
        {loading ? (
          <CircularProgress />
        ) : (
          <div>
            {images.map((image) => (
              <div key={image.uuid} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <img src={image.url} alt={image.uuid} style={{ width: "100px", height: "100px" }} />
                <Button variant="contained" color="secondary" onClick={() => handleDeleteImg(image.uuid, image.url)}>
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
