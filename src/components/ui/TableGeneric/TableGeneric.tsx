import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { ButtonsTable } from "../ButtonsTable/ButtonsTable";
import { useAppSelector } from "../../../hooks/redux";
import { TextField, Box } from "@mui/material";

// Definimos la interfaz para cada columna de la tabla
interface ITableColumn<T> {
  label: string; // Etiqueta de la columna
  key: string; // Clave que corresponde a la propiedad del objeto en los datos
  render?: (item: T) => React.ReactNode; // Función opcional para personalizar la renderización del contenido de la celda
}

export interface ITableProps<T> {
  columns: ITableColumn<T>[]; // Definición de las columnas de la tabla
  handleDelete: (id: number) => void; // Función para manejar la eliminación de un elemento
  setOpenModal: (state: boolean) => void;
}

export const TableGeneric = <T extends { id: any; eliminado?: boolean; habilitado?: boolean }>({
  columns,
  handleDelete,
  setOpenModal,
}: ITableProps<T>) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Función para cambiar de página
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Función para cambiar el número de filas por página
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Estado para almacenar las filas de la tabla
  const [, setRows] = useState<any[]>([]);

  // Obtener los datos de la tabla del estado global
  const dataTable = useAppSelector((state) => state.tablaReducer.dataTable);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState<any[]>([]);

  useEffect(() => {
    setRows(dataTable);
    setFilteredRows(dataTable);
  }, [dataTable]);

  useEffect(() => {
    const results = dataTable.filter(
      (row) =>
        row.denominacion &&
        row.denominacion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRows(results);
    setPage(0);
  }, [searchTerm, dataTable]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        mt: 2,
      }}
    >
      <TextField
        label="Buscar producto"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, width: "90%" }}
      />
      <Paper sx={{ width: "90%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "80vh" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, i: number) => (
                  <TableCell key={i} align={"center"}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index: number) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                      style={{
                        backgroundColor: row.eliminado || !row.habilitado ? "grey" : "white" ,
                        position: 'relative',
                        zIndex: row.eliminado || !row.habilitado ? 3 : 'auto',
                      }}
                    >
                      {columns.map((column, i: number) => {
                        return (
                          <TableCell key={i} align={"center"}>
                            {column.render ? (
                              column.render(row)
                            ) : column.label === "Acciones" ? (
                              <ButtonsTable
                                el={row}
                                handleDelete={handleDelete}
                                setOpenModal={setOpenModal}
                              />
                            ) : (
                              row[column.key]
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
