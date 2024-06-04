import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IImagenes from "../../../types/Imagenes";
import { IconButton } from "@mui/material";


interface Props {
    images: IImagenes[];
    handleDeleteImage: (publicId: string, id: number) => void;
}

export const ImageCarrousel: React.FC<Props> = ({ images, handleDeleteImage }) => {

    const handleDelete = (publicId: string, id: number) => {
        handleDeleteImage(publicId, id); // Llama al método handleDeleteImage con el publicId y el idArticulo
    };

    const extractPublicIdFromUrl = (url: string) => {
        const parts = url.split('/');
        const fileName = parts[parts.length - 1];
        const publicId = fileName.split('.')[0];
        console.log("PUBLIC ID", publicId);
        
        return publicId;
    };
    
    return (
        <Carousel>
            {images.map((image) => (
                <Carousel.Item key={image.id}>
                    <img
                        className="d-block mx-auto"
                        style={{ maxHeight: "300px", maxWidth: "100%", margin: "0 auto" }}
                        src={image.url}
                        alt={`Slide ${image.id}`}
                    />
                    <Carousel.Caption>
                        <IconButton
                            color="error"
                            onClick={() => handleDelete(extractPublicIdFromUrl(image.url), image.id)} // Pasa el idArticulo a la función handleDelete
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};