import {  FC, useEffect, useState } from "react";
import PromocionEditDto from "../../../../types/Dtos/PromocionDto/PromocionEditDto";
import { ICategoria } from "../../../../types/Categoria";
import { SucursalService } from "../../../../services/SucursalService";
import { InsumoGetService } from "../../../../services/InsumoGetService";
import {  useAppSelector } from "../../../../hooks/redux";
import IArticuloInsumo from "../../../../types/ArticuloInsumo";
import ISucursales from "../../../../types/Sucursales";



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

  console.log(handleClose,getData);

  
  const [, setCategoria] = useState<ICategoria[]>([]);
  const [, setDataIngredients] = useState<any[]>([]);

  const [, setSelectedDetalle] = useState<any[]>([]);
  const [, setSelectedSucursales] = useState<number[]>([]);
  const [, setItemValue] = useState<PromocionEditDto>(initialValues);

  const sucursalService = new SucursalService(`${API_URL}/sucursal`);


  const insumosServices = new InsumoGetService(`${API_URL}/ArticuloInsumo`);



  const data = useAppSelector((state) => state.tablaReducer.elementActive);

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






  return (
    <div>hola</div>
  );
}