import { useEffect, useState } from "react";

import { TableGeneric } from "../../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

import { removeElementActive, setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";

//Importamos IPromocion y Empresa Service                                
import IPromocion from "../../../types/Promocion";
import { PromocionService } from "../../../services/PromocionService";
import { ModalPromocion } from "../../ui/modals/ModalPromocion/ModalPromocion";   //*cambiar al final*/
import { SucursalService } from "../../../services/SucursalService";


// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenPromociones = () => {                                        
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const promocionService = new PromocionService(API_URL + "/promociones");
  const sucursalService = new SucursalService(API_URL + "/sucursal");

  //obtenemos la sucursal actual
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);


  const dispatch = useAppDispatch();
  // Columnas de la tabla de personas
  const ColumnsTablePromocion= [                                                                           
    /* {
      label: "ID",
      key: "id",
      render: (promocion: IPromocion) => (promocion?.id ? promocion.id : 0),
    }, */
    { label: "Denominacion", key: "denominacion" },
    { label: "FechaDesde", key: "fechaDesde" },
    { label: "FechaHasta", key: "fechaHasta" },
    { label: "HoraDesde", key: "horaDesde" },
    { label: "HoraHasta", key: "horaHasta" },
    { label: "DescripcionDescuento", key: "descripcionDescuento" },
    { label: "PrecioPromocional", key: "precioPromocional" },
    { label: "TipoPromocion", key: "tipoPromocion" },
/*     { label: "Articulos", key: "articulos" },
    { label: "Imagenes", key: "imagenes" }, */
    
        /* {
      label: "Sucursal",
      key: "sucursalEmpresa", //OJITO  ABIERTO O CERRADO 
    }, */
    { label: "Acciones", key: "acciones" },
  ];

  // Función para manejar el borrado de una persona
  const handleDelete = async (id: number) => {
    // Mostrar confirmación antes de eliminar
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres eliminar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar la persona si se confirma
        promocionService.delete(id).then(() => {
          getPromocion();                                     
        });
      }
    });
  };

  // Función para obtener las promociones
  const getPromocion = async () => {
    if (sucursalActual) {
      try {
        const promocionData = await sucursalService.getPromociones(sucursalActual.id);

  
        if (Array.isArray(promocionData)) {
          dispatch(setDataTable(promocionData));
        } else {
          console.error("La respuesta de getPromociones no es un array:", promocionData);   
         }
      } catch (error) {
        console.error("Error al obtener las promociones:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Efecto para cargar los datos al inicio

  /* useEffect(() => {
    setLoading(true);
    getPromocion();                                               
  }, []); */

  useEffect(() => {
    if (sucursalActual) {
      setLoading(true);
      getPromocion();
    }
  }, [sucursalActual]);

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
  };

  return (
    <>
      <div>
        <div
          style={{
            padding: ".4rem",
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
          }}
        >
          {/* Botón para abrir el modal de agregar persona */}
          <Button
            onClick={() => {
              setOpenModal(true);
            }}
            variant="contained"
          >
            <span className="material-symbols-outlined">add</span>
            Agregar Promocion
          </Button>
        </div>
        {/* Mostrar indicador de carga mientras se cargan los datos */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              gap: "2vh",
              height: "100%",
            }}
          >
            <CircularProgress color="secondary" />
            <h2>Cargando...</h2>
          </div>
        ) : (
          // Mostrar la tabla de personas una vez que los datos se han cargado
          <TableGeneric<IPromocion>                                              
            handleDelete={handleDelete}
            columns={ColumnsTablePromocion}
            setOpenModal={setOpenModal}
          />
        )}
      </div>

      {/* Modal para agregar o editar una persona */}
      <ModalPromocion
        getData={getPromocion}
        open={openModal}
        //setOpenModal={setOpenModal}
        handleClose={handleClose}
      />
    </>
  );
};