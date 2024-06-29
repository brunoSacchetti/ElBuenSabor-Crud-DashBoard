import React, { useEffect, useState } from "react";
import { Modal, Button, Select, MenuItem } from "@mui/material";
import { CategoriaService } from "../../../../services/CategoriaService";
import IArticuloInsumo from "../../../../types/ArticuloInsumo";
import { TableModal2 } from "../../TableInsumo2/TableModal2";

import { InsumoGetService } from "../../../../services/InsumoGetService";

const API_URL = import.meta.env.VITE_API_URL;

interface InsumosModalProps {
  open: boolean;
  handleClose: () => void;
  handleAddInsumos: (selectedInsumos: any[]) => void;
}

export const InsumosModal: React.FC<InsumosModalProps> = ({
  open,
  handleClose,
  handleAddInsumos,
}) => {
  const [insumos, setInsumos] = useState<IArticuloInsumo[]>([]);
  const [selectedInsumos, setSelectedInsumos] = useState<any[]>([]);
  //const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoria, setCategoria] = useState<any[]>([]);

  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const insumosServices = new InsumoGetService(API_URL + "/ArticuloInsumo");

  useEffect(() => {
    const fetchInsumos = async () => {
      if (open) {
        const insumosData = await getInsumos();
        setInsumos(insumosData);
      }
    };
  
    fetchInsumos();
  }, [open]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categorias = await categoriaService.getAll();
        setCategoria(categorias);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const getInsumos = async () => {
    try {
      const data: IArticuloInsumo[] = await insumosServices.getAll();
  
      // Filtrar los insumos que no son para elaborar
      const insumosElaborarHabilitados: IArticuloInsumo[] = data.filter(
        (insumo) => insumo.esParaElaborar && insumo.habilitado
      );
  
      return insumosElaborarHabilitados;
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
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Seleccionar Insumos</h2>
        
        {/* <TextField
          label="Buscar ingrediente"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 20, width: "100%" }}
        /> */}

        <TableModal2
          dataIngredients={insumos}
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
