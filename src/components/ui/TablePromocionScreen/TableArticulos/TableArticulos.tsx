import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { MenuItem, Select, Checkbox } from "@mui/material";
import IArticuloGenerico from "../../../../types/ArticuloGenerico/IArticuloGenerico";
import { CategoriaService } from "../../../../services/CategoriaService";
import { useAppSelector } from "../../../../hooks/redux";
import { SucursalService } from "../../../../services/SucursalService";

const API_URL = import.meta.env.VITE_API_URL;

interface ITableIngredientsProps {
  dataIngredients: IArticuloGenerico[];
  onSelect: (selectedData: IArticuloGenerico[]) => void;
}

export const TableArticulo: React.FC<ITableIngredientsProps> = ({
  dataIngredients,
  onSelect,
}) => {
  const [originalRows, setOriginalRows] = useState<IArticuloGenerico[]>([]);
  const [displayedRows, setDisplayedRows] = useState<IArticuloGenerico[]>([]);
  const [selectedRows, setSelectedRows] = useState<IArticuloGenerico[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number>(-1);
  const [categoria, setCategoria] = useState<any[]>([]);
  const [selectedCategoryItems, setSelectedCategoryItems] = useState<IArticuloGenerico[]>([]);
  const [cantidadMap, setCantidadMap] = useState<{ [key: string]: number }>({});

  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);
  const sucursalService = new SucursalService(API_URL + "/sucursal");

  const getCategorias = async () => {
    if (!sucursalActual) {
      console.error("Error al obtener categorias: sucursalActual es null");
      return;
    }
    try {
      const data = await sucursalService.getCategoriasPorSucursal(sucursalActual?.id);
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    }
  };

  useEffect(() => {
    getCategorias();
  }, [sucursalActual]);

  useEffect(() => {
    setOriginalRows(dataIngredients);
    setDisplayedRows(dataIngredients);
  }, [,dataIngredients]);

  useEffect(() => {
    let results: IArticuloGenerico[] = [];

    if (selectedCategoryItems.length === 0) {
      results = originalRows;
    } else {
      results = selectedCategoryItems;
    }

    results = results.filter((item) =>
      item.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setDisplayedRows(results);
  }, [searchTerm, selectedCategoryItems, originalRows]);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowData: IArticuloGenerico
  ) => {
    const checked = event.target.checked;
    let updatedSelectedRows;
    if (checked) {
      updatedSelectedRows = [...selectedRows, rowData];
    } else {
      updatedSelectedRows = selectedRows.filter((row) => row.id !== rowData.id);
    }
    setSelectedRows(updatedSelectedRows);
    onSelect(updatedSelectedRows.map(row => ({
      ...row,
      cantidad: cantidadMap[row.id] || 0,
    })));
  };

  const handleCantidadChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    rowData: IArticuloGenerico
  ) => {
    const newCantidad = parseFloat(event.target.value) || 0;
    setCantidadMap(prev => ({
      ...prev,
      [rowData.id]: newCantidad,
    }));

    const updatedSelectedRows = selectedRows.map((row) => {
      if (row.id === rowData.id) {
        return { ...row, cantidad: newCantidad };
      }
      return row;
    });
    setSelectedRows(updatedSelectedRows);
    onSelect(updatedSelectedRows);
  };

  const onSelectCategory = async (categoryId: number) => {
    setSelectedCategoriaId(categoryId);
    if (categoryId === -1) {
      setSelectedCategoryItems([]);
    } else {
      const categoriaService = new CategoriaService(API_URL + "/categoria");
      const selectedCategory = await categoriaService.getById(categoryId);
      setSelectedCategoryItems(selectedCategory?.items || []);
    }
  };

  return (
    <div>
      <TextField
        label="Buscar artículo"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 20, width: "30%" }}
      />
      {/* <Select
        style={{ marginLeft: 40 }}
        label="Categorías"
        variant="filled"
        value={selectedCategoriaId}
        onChange={(e) => onSelectCategory(e.target.value as number)}
      >
        <MenuItem value={-1}>Todas las Categorías</MenuItem>
        {categoria.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.denominacion}
          </MenuItem>
        ))}
      </Select> */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "55vh", height: "600px" }}
      >
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              {/* <TableCell align="center">Id</TableCell> */}
              <TableCell align="center">Artículo</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="center">Seleccionar</TableCell>
              {/* <TableCell align="center">Seleccionar</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedRows.map((row) => (
              <TableRow key={row.id}>
                {/* <TableCell align="center">{row.id}</TableCell> */}
                <TableCell align="center">{row.denominacion}</TableCell>
                <TableCell align="center">
                  <TextField
                    type="number"
                    value={cantidadMap[row.id] || 0}
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
