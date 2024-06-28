import { Button } from "@mui/material";
import { useAppDispatch } from "../../../../hooks/redux";
import { setElementActive } from "../../../../redux/slices/TablaReducer";
import IArticuloManufacturado from "../../../../types/ArticuloManufacturado";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Interfaz para los props del componente
interface IButtonsTable {
  el: IArticuloManufacturado; // Elemento de tipo IPersona
  handleDelete: (id: number | string) => void; // Función para manejar la eliminación de un elemento
  setOpenModal: (state: boolean) => void; // Función para manejar la eliminación de un elemento
  handleCancelOrRegister: (
    id: number | string,
    el: IArticuloManufacturado
  ) => void;
}

export const ButtonsTable = ({
  el,
  //handleDelete,
  setOpenModal,
  handleCancelOrRegister,
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
  /* const handleDeleteItem = () => {
    const handleDeleteElement = () => {
      handleDelete(el.id); // Llamar a la función handleDelete con el ID del elemento
    };
    handleConfirm(
      "Seguro quieres eliminar el articulo manufacturado",
      handleDeleteElement
    );
  }; */

  const handleChangeRegisterOrCancelItem = () => {
    handleCancelOrRegister(el.id, { ...el, alta: !el.alta });
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
        style={{ pointerEvents: !el.habilitado ? "none" : "auto" }}
      >
        <span className="material-symbols-outlined">edit</span>
      </Button>

      {/* Deshabilitado Y Habilitado */}
      {el.habilitado === true ? (
        <Button
          onClick={handleChangeRegisterOrCancelItem}
          style={{ borderRadius: '50px' }}
          variant="contained"
          color="error"
        >
          Deshabilitar
          <VisibilityOff style={{ marginLeft: '6px' }} />
        </Button>
      ) : (
        <Button
          onClick={handleChangeRegisterOrCancelItem}
          variant="contained"
          style={{ borderRadius: '50px' }}
          color="success"
        >
          Habilitar
          <Visibility style={{ marginLeft: '6px' }} />
        </Button>
      )}


    </div>
  );
};
