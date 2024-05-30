import React, { useEffect, useState } from "react";
import { Modal, Button, TextField, Select, MenuItem } from "@mui/material";
import { CategoriaService } from "../../../../services/CategoriaService";
import IArticuloInsumo from "../../../../types/ArticuloInsumo";
import { TableModal2 } from "../../TableInsumo2/TableModal2";

import { InsumoGetService } from "../../../../services/InsumoGetService";
import { useAppSelector } from "../../../../hooks/redux";
import { SucursalService } from "../../../../services/SucursalService";
import IArticuloManufacturado from "../../../../types/ArticuloManufacturado";
import { TableArticulo } from "../../TablePromocionScreen/TableArticulos/TableArticulos";

const API_URL = import.meta.env.VITE_API_URL;

interface InsumosModalProps {
  open: boolean;
  handleClose: () => void;
  handleAddInsumos: (selectedInsumos: IUnifiedArticulo[]) => void;
}

interface IUnifiedArticulo extends IArticuloInsumo {
  tipo: 'insumo' | 'articulo';
}

export const ArticulosPromoModal: React.FC<InsumosModalProps> = ({
  open,
  handleClose,
  handleAddInsumos,
}) => {
  const [insumos, setInsumos] = useState<IArticuloInsumo[]>([]);
  const [selectedInsumos, setSelectedInsumos] = useState<any[]>([]);
  //const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoria, setCategoria] = useState<any[]>([]);
  const [articulosManufacturados, setArticulosManufacturados] = useState<IArticuloManufacturado[]>([]);

  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const insumosServices = new InsumoGetService(API_URL + "/ArticuloInsumo");

  const sucursalService = new SucursalService(API_URL + "/sucursal");
  
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);

  /* useEffect(() => {
    const fetchInsumos = async () => {
      if (open) {
        const insumosData = await getInsumos();
        setInsumos(insumosData);
      }
    };
  
    fetchInsumos();
  }, [open]); */

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    await getCategorias();
    await filterInsumosAndArticulos();
  };

  const getCategorias = async () => {
    if (!sucursalActual) {
      console.error("Error al obtener categorias: sucursalActual es null");
      return;
    }
    try {
      console.log(sucursalActual);
      const data = await sucursalService.getCategoriasPorSucursal(sucursalActual?.id);
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  const filterInsumosAndArticulos = () => {
    const allInsumos: IArticuloInsumo[] = [];
    const allArticulos: IArticuloManufacturado[] = [];
  
    categoria.forEach((cat) => {
      const insumosNoElaborar = cat.insumos.filter((insumo: any) => !insumo.esParaElaborar);
      allInsumos.push(...insumosNoElaborar);
      allArticulos.push(...cat.articulosManufacturados);
    });
  
    console.log("Insumos:", allInsumos);
    console.log("Artículos manufacturados:", allArticulos);
  
    // Combinar insumos y artículos manufacturados
    const combinedItems = [
      ...allInsumos.map(item => ({ ...item, tipo: 'insumo' })),
      ...allArticulos.map(item => ({ ...item, tipo: 'articulo' })),
    ];
    setFilteredItems(combinedItems);
  
    console.log("Items combinados:", combinedItems);
  };
  

 /*  useEffect(() => {

    getCategorias();
    
  }, []); */

  const getInsumos = async () => {
    try {
      const data: IArticuloInsumo[] = await insumosServices.getAll();
  
      // Filtrar los insumos que no son para elaborar
      const insumosNoElaborar: IArticuloInsumo[] = data.filter(
        (insumo) => insumo.esParaElaborar
      );
  
      return insumosNoElaborar;
    } catch (error) {
      console.error("Error al obtener insumos:", error);
      return [];
    }
  };

  const handleAdd = () => {
    handleAddInsumos(selectedInsumos);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ width: "80%", margin: "auto", marginTop: "50px", backgroundColor: "white", padding: "20px", borderRadius: "5px" }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Seleccionar Productos para la Promocion</h2>
        {/* <TextField
          label="Buscar ingrediente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 20, width: "100%" }}
        /> */}
        <Select
          label="Categorias"
          variant="filled"
          style={{ marginBottom: 20, width: "100%" }}
        >
          {/* Aquí debes mapear las categorías */}
          {categoria.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.denominacion}
            </MenuItem>
          ))}
        </Select>
        <TableArticulo
          dataIngredients={filteredItems}
          onSelect={(selectedData) => setSelectedInsumos(selectedData)}
        />
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Button onClick={handleAdd} variant="contained" style={{ marginRight: "10px" }}>
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
