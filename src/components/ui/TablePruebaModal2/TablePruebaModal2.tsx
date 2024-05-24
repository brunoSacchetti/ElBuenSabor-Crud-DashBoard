import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import IArticuloManufacturadoDetalle from "../../../types/ArticuloManufacturadoDetalle";

const columns = [
  {
    label: "Id",
    key: "id",
  },
  {
    label: "Ingrediente",
    key: "ingrediente",
    render: (element: IArticuloManufacturadoDetalle) => element?.insumo?.denominacion ?? "N/A",
  },
  {
    label: "Unidad de medida",
    key: "unidadMedida",
    render: (element: IArticuloManufacturadoDetalle) => element?.insumo?.unidadMedida.denominacion ?? "N/A",
  },
  {
    label: "Cantidad",
    key: "cantidad",
    render: (element: IArticuloManufacturadoDetalle) => element?.cantidad ?? "N/A",
  },
  /* {
    label: "Quitar",
    key: "quitar",
    render: (element: IProductoDetalle, handleRemoveInsumo: any) => (
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => handleRemoveInsumo(element.id)}
      >
        Quitar
      </Button>
    ),
  }, */
];

interface ITableIngredients {
  dataIngredients: IArticuloManufacturadoDetalle[];
  //onRemove: (id: number) => void;
}

export const TablePruebaModal2 = ({
  dataIngredients,
  //onRemove,
}: ITableIngredients) => {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const updatedRows = dataIngredients.map((ingredient, index) => ({
      ...ingredient,
      id: index + 1,
      cantidad: ingredient.cantidad || 0,
    }));
    setRows(updatedRows);
  }, [dataIngredients]);

  return (
    <div>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "55vh", height: "600px" }}
      >
        <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column, i) => (
                <TableCell key={i} align="center">
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column, i) => (
                  <TableCell key={i} align="center">
                    {column.render ? (
                      column.render(row)//, onRemove)
                    ) : (
                      row[column.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
