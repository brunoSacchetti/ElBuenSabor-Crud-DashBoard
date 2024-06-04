import React, { useEffect, useState } from "react";
import { Modal, Button, Select, MenuItem } from "@mui/material";
import { SucursalService } from "../../../../services/SucursalService";
import { useAppSelector } from "../../../../hooks/redux";
import { TableArticulo } from "../../TablePromocionScreen/TableArticulos/TableArticulos";
import IArticuloGenerico from "../../../../types/ArticuloGenerico/IArticuloGenerico";

const API_URL = import.meta.env.VITE_API_URL;

interface InsumosModalProps {
  open: boolean;
  handleClose: () => void;
  handleAddInsumos: (selectedInsumos: IArticuloGenerico[]) => void;
}

export const ArticulosPromoModal: React.FC<InsumosModalProps> = ({
  open,
  handleClose,
  handleAddInsumos,
}) => {
  const [selectedInsumos, setSelectedInsumos] = useState<IArticuloGenerico[]>([]);
  const [categoria, setCategoria] = useState<any[]>([]);
  const [articuloGenerico, setArticuloGenerico] = useState<IArticuloGenerico[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const sucursalService = new SucursalService(API_URL + "/sucursal");
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    await getCategorias();
    await filterInsumos();
    await filterArticulosManufacturados();
    setLoading(false);
  };

  const getCategorias = async () => {
    if (!sucursalActual) {
      console.error("Error al obtener categorias: sucursalActual es null");
      return;
    }
    try {
      const data = await sucursalService.getCategoriasPorSucursal(sucursalActual.id);

      
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  
  const [insumosGenericos, setInsumosGenericos] = useState<IArticuloGenerico[]>([]);
  const [articulosManufacturadosGenericos, setArticulosManufacturadosGenericos] = useState<IArticuloGenerico[]>([]);

  const filterInsumos = async () => {
    const allInsumos: IArticuloGenerico[] = [];
    categoria.forEach((cat) => {
      const insumosNoElaborar = cat.insumos
        .filter((insumo: any) => !(insumo.esParaElaborar))
        .map((insumo: any) => ({
          id: insumo.id,
          denominacion: insumo.denominacion,
        }));
      allInsumos.push(...insumosNoElaborar);
    });
    setInsumosGenericos(allInsumos);
  };

  const filterArticulosManufacturados = async () => {
    const allArticulosManufacturados: IArticuloGenerico[] = [];
    console.log(categoria);
    
    
    categoria.forEach((cat) => {
      const articulosManufacturados = cat.articulosManufacturados.map(
        (articulo: any) => ({
          id: articulo.id,
          denominacion: articulo.denominacion,
        })
      );
      allArticulosManufacturados.push(...articulosManufacturados);
    });
    setArticulosManufacturadosGenericos(allArticulosManufacturados);
  };

  useEffect(() => {
    setArticuloGenerico([...insumosGenericos, ...articulosManufacturadosGenericos]);
  }, [insumosGenericos, articulosManufacturadosGenericos]);

  
  const handleAdd = () => {
    handleAddInsumos(selectedInsumos);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div
        style={{
          width: "80%",
          margin: "auto",
          marginTop: "50px",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Seleccionar Productos para la Promocion
        </h2>

        {loading ? (
          <div style={{ textAlign: "center" }}>Cargando...</div>
        ) : (
          <>
            <Select
              label="Categorias"
              variant="filled"
              style={{ marginBottom: 20, width: "100%" }}
              value={-1}
              onChange={(e) => {}}
            >
              <MenuItem value={-1}>Todas las Categorías</MenuItem>
              {categoria.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.denominacion}
                </MenuItem>
              ))}
            </Select>
            <TableArticulo
              dataIngredients={articuloGenerico}
              onSelect={(selectedData) => setSelectedInsumos(selectedData)}
            />
          </>
        )}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Button
            onClick={handleAdd}
            variant="contained"
            style={{ marginRight: "10px" }}
          >
            Agregar
          </Button>
          <Button onClick={handleClose} variant="contained">
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
