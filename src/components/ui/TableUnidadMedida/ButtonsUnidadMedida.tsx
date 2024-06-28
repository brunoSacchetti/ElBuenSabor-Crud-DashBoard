import { Button } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";
import { setElementActive } from "../../../redux/slices/TablaReducer";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Interfaz para los props del componente
interface IButtonsTable {
  el: any; // Elemento de tipo IPersona
  handleDelete: (id: number) => void; // Función para manejar la eliminación de un elemento
  setOpenModal: (state: boolean) => void; // Función para manejar la eliminación de un elemento
}

export const ButtonsUnidadMedida = ({
  el,
  handleDelete,
  setOpenModal,
}: IButtonsTable) => {
  const dispatch = useAppDispatch();

  // Función para manejar la selección del modal para editar
  const handleModalSelected = () => {
    // Establecer el elemento activo en el estado
    dispatch(setElementActive({ element: el }));
    // Mostrar el modal para editar el elemento
    setOpenModal(true);
  };

  // Función para manejar la eliminación de un elemento
  const handleDeleteItem = () => {
    handleDelete(el.id); // Llamar a la función handleDelete con el ID del elemento
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {/* Botón para editar el elemento */}
      <Button
        variant="contained"
        onClick={handleModalSelected}
        style={{ pointerEvents: el.eliminado ? "none" : "auto" }}
      >
        <span className="material-symbols-outlined">edit</span>
      </Button>
      
      {/* Botón para habilitar/deshabilitar el elemento */}
      {el.eliminado ? (
        <Button
          style={{ borderRadius: '50px' }}
          variant="contained"
          onClick={handleDeleteItem}
          color="success"
        >
          Habilitar
          <Visibility style={{ marginLeft: '6px' }} />
        </Button>
      ) : (
        <Button
          style={{ borderRadius: '50px' }}
          color="error"
          variant="contained"
          onClick={handleDeleteItem}
        >
          Deshabilitar
          <VisibilityOff style={{ marginLeft: '6px' }} />
        </Button>
      )}
    </div>
  );
};
