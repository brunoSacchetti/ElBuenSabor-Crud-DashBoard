import { ChangeEvent, FC, useEffect, useState } from "react";
import PromocionEditDto from "../../../../types/Dtos/PromocionDto/PromocionEditDto";
import { ICategoria } from "../../../../types/Categoria";
import { SucursalService } from "../../../../services/SucursalService";
import { PromocionService } from "../../../../services/PromocionService";
import { PromocionDetalleService } from "../../../../services/PromocionDetalleService";
import { InsumoGetService } from "../../../../services/InsumoGetService";
import { PromocionPutService } from "../../../../services/PromocionPutService";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import IArticuloInsumo from "../../../../types/ArticuloInsumo";
import ISucursales from "../../../../types/Sucursales";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";


const API_URL = import.meta.env.VITE_API_URL;

// #region ARREGLAR ID SUCURSAL, PROMOCION DETALLE SIN DETALLE NO SE AGREGA, EL ID NO SE MANDA Y QUEDA EN 0

const initialValues: PromocionEditDto = {
  id: 0,
  fechaDesde: "",
  fechaHasta: "",
  horaDesde: "",
  horaHasta: "",
  precioPromocional: 0,
  detalles: [
    {
      cantidad: 0,
      idArticulo: 0,
    },
  ],
};

interface IMasterDetailModal {
  open: boolean;
  getData: () => void;
  handleClose: () => void;
}

export const ModalPromocionEdit: FC<IMasterDetailModal> = ({
  handleClose,
  open,
  getData,
}) => {

  const [categoria, setCategoria] = useState<ICategoria[]>([]);
  const [dataIngredients, setDataIngredients] = useState<any[]>([]);
  const [openInsumosModal, setOpenInsumosModal] = useState<boolean>(false);
  const [selectedDetalle, setSelectedDetalle] = useState<any[]>([]);
  const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);
  const [itemValue, setItemValue] = useState<PromocionEditDto>(initialValues);

  const sucursalService = new SucursalService(`${API_URL}/sucursal`);
  const promocionService = new PromocionService(`${API_URL}/promocion`);
  const promocionDetalleService = new PromocionDetalleService(`${API_URL}/promocionDetalle`);
  const insumosServices = new InsumoGetService(`${API_URL}/ArticuloInsumo`);
  const promocionPutService = new PromocionPutService(`${API_URL}/promocion`);

  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.tablaReducer.elementActive);
  const sucursales = useAppSelector((state) => state.sucursal.data);
  const sucursalActual = useAppSelector(
    (state) => state.sucursal.sucursalActual
  );

  const getCategorias = async () => {
    if (!sucursalActual) {
      console.error("Error al obtener categorias: sucursalActual es null");
      return;
    }
    try {
      const data = await sucursalService.getCategoriasPorSucursal(
        sucursalActual?.id
      );
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  const getInsumos = async () => {
    try {
      const data = await insumosServices.getAll();
      const insumosNoElaborar: IArticuloInsumo[] = data.filter(
        (insumo) => insumo.esParaElaborar
      );

      setDataIngredients(
        insumosNoElaborar.map((insumo) => ({
          cantidad: 0,
          insumo: insumo,
        }))
      );
    } catch (error) {
      console.error("Error al obtener insumos:", error);
    }
  };
  
  useEffect(() => {
    if (open && sucursalActual) {
      getInsumos();
      getCategorias();
      if (data) {
        // Si hay datos de promoción, establecer las sucursales asociadas
        setSelectedSucursales(data.sucursales.map((sucursal:ISucursales) => sucursal.id));
      }
    }
  }, [open, sucursalActual,]);
  
  const resetValues = () => {
    setItemValue(initialValues);
    setSelectedDetalle([]);
    setDataIngredients([]);
  };

  useEffect(() => {
    if (data) {
      const promocionData: PromocionEditDto = data as PromocionEditDto;
      setItemValue({
        id: promocionData.id,
        fechaDesde: promocionData.fechaDesde,
        fechaHasta: promocionData.fechaHasta,
        horaDesde: promocionData.horaDesde,
        horaHasta: promocionData.horaHasta,
        precioPromocional: promocionData.precioPromocional,
        detalles: promocionData.detalles,
      });
      console.log("Promoción en modo edición:", promocionData);
    } else {
      resetValues();
    }
  }, [data]);

  const handlePropsElementsInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setItemValue({
      ...itemValue,
      [name]: value,
    });
  };


  const handleDateChange = (name: string, value: string) => {
    setItemValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleConfirmEdit = async () => {
    try {
      // Verifica que todos los campos obligatorios estén completos
      if (
        itemValue.fechaDesde.trim() === "" ||
        itemValue.fechaHasta.trim() === "" ||
        itemValue.horaDesde.trim() === "" ||
        itemValue.horaHasta.trim() === "" ||
        itemValue.precioPromocional === 0
      ) {
        // Muestra un mensaje de error con SweetAlert
        console.error("Por favor completa todos los campos obligatorios antes de confirmar.");
        return;
      }
  
      // Aquí puedes realizar cualquier validación adicional antes de enviar los datos
  
      // Envía los datos actualizados al servidor
      await promocionPutService.put(itemValue.id, itemValue);
  
      // Muestra un mensaje de éxito con SweetAlert
      console.log("Promoción editada correctamente.");
  
      // Cierra el modal y actualiza los datos
      handleClose();
      resetValues();
      getData();
      dispatch(removeElementActive());
    } catch (error) {
      console.error("Error al confirmar la edición de la promoción:", error);
      // Muestra un mensaje de error con SweetAlert si falla la edición
    }
  };

  return (
    <div>hola</div>
  );
}