import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { MenuItem, Select } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import IArticuloInsumo from "../../../../types/ArticuloInsumo";
import { CategoriaService } from "../../../../services/CategoriaService";
import IArticuloManufacturado from "../../../../types/ArticuloManufacturado";

const API_URL = import.meta.env.VITE_API_URL;

interface ITableIngredientsProps {
  dataIngredients: IArticuloInsumo[];
  onSelect: (selectedData: IArticuloInsumo[]) => void;
}

interface ITableRow extends IArticuloInsumo {
  id: number;
}

export const TableArticulo: React.FC<ITableIngredientsProps> = ({
  dataIngredients,
  onSelect,
}) => {
  const [originalRows, setOriginalRows] = useState<ITableRow[]>([]);
  const [displayedRows, setDisplayedRows] = useState<ITableRow[]>([]);
  const [selectedRows, setSelectedRows] = useState<ITableRow[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number>(-1);
  const [categoria, setCategoria] = useState<any[]>([]);
  const [selectedCategoryInsumos, setSelectedCategoryInsumos] = useState<any[]>([]);

  useEffect(() => {
    const categoriaService = new CategoriaService(API_URL + "/categoria");
    categoriaService.getAll().then((data) => {
      setCategoria(data);
    });
  }, []);

  /* useEffect(() => {
    setOriginalRows(
      dataIngredients.map((ingredient, index) => ({
        ...ingredient,
        id: index + 1,
        cantidad: ingredient.cantidad || 0,
      }))
    );
  }, [dataIngredients]); */

  useEffect(() => {
    setOriginalRows(
      dataIngredients.map((ingredient) => ({
        ...ingredient,
        cantidad: ingredient.cantidad || 0,
      }))
    );
  }, [dataIngredients]);
  

  useEffect(() => {
    let results: ITableRow[] = [];

    if (selectedCategoryInsumos.length === 0) {
      results = originalRows;
    } else {
      results = selectedCategoryInsumos;
    }

    // Filtrar por término de búsqueda
    results = results.filter((ingredient) =>
      ingredient.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setDisplayedRows(results);
  }, [searchTerm, selectedCategoryInsumos, originalRows]);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowData: ITableRow
  ) => {
    const checked = event.target.checked;
    let updatedSelectedRows;
    if (checked) {
      // Si el checkbox está marcado, agregar la fila a las filas seleccionadas
      updatedSelectedRows = [...selectedRows, rowData];
    } else {
      // Si el checkbox está desmarcado, quitar la fila de las filas seleccionadas
      updatedSelectedRows = selectedRows.filter(
        (row) => row.id !== rowData.id
      );
    }
    setSelectedRows(updatedSelectedRows);
    onSelect(updatedSelectedRows); // Asegúrate de llamar a onSelect aquí para actualizar el estado seleccionado
    console.log();
    
  };

  const handleCantidadChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    rowData: ITableRow
  ) => {
    const newCantidad = parseFloat(event.target.value);
    const updatedDisplayedRows = displayedRows.map((row) => {
      if (row.id === rowData.id) {
        return { ...row, cantidad: newCantidad };
      }
      return row;
    });
    setDisplayedRows(updatedDisplayedRows);
  
    const updatedOriginalRows = originalRows.map((row) => {
      if (row.id === rowData.id) {
        return { ...row, cantidad: newCantidad };
      }
      return row;
    });
    setOriginalRows(updatedOriginalRows);
  
    const updatedSelectedRows = selectedRows.map((row) => {
      if (row.id === rowData.id) {
        return { ...row, cantidad: newCantidad };
      }
      return row;
    });
    setSelectedRows(updatedSelectedRows);
    onSelect(updatedSelectedRows); // Asegúrate de llamar a onSelect aquí para actualizar el estado seleccionado
    
    console.log(selectedRows);
  };

  const onSelectCategory = async (categoryId: number) => {
    setSelectedCategoriaId(categoryId);
    if (categoryId === -1) {
      setSelectedCategoryInsumos([]);
    } else {
      const categoriaService = new CategoriaService(API_URL + "/categoria");
      const selectedCategory = await categoriaService.getById(categoryId);
      setSelectedCategoryInsumos(selectedCategory?.insumos || []);
    }
  };

  return (
    <div>
      <TextField
        label="Buscar articulo"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20, width: "30%" }}
      />
      <Select
        style={{ marginLeft: 40 }}
        label="Categorías"
        variant="filled"
        value={selectedCategoriaId}
        onChange={(e) => onSelectCategory(e.target.value as number)}
      >
        <MenuItem value={-1}>Todas las Categorias</MenuItem>
        {categoria.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.denominacion}
          </MenuItem>
        ))}
      </Select>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "55vh", height: "600px" }}
      >
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Id</TableCell>
              <TableCell align="center">Ingrediente</TableCell>
              <TableCell align="center">Unidad de medida</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="center">Seleccionar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.id}</TableCell>
                <TableCell align="center">{row.denominacion}</TableCell>
                <TableCell align="center">{row.unidadMedida?.denominacion ?? "N/A"}</TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    value={row.cantidad}
                    onChange={(event) => handleCantidadChange(event, row)}
                    variant="filled"
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={selectedRows.some(
                      (selectedRow) => selectedRow.id === row.id
                    )}
                    onChange={(event) => handleCheckboxChange(event, row)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
