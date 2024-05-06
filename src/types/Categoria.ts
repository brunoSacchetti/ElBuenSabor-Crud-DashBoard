interface Categoria extends Base<Categoria>{
  denominacion: string,
  articulos: [],
  subCategorias: Categoria[]
}

export default Categoria;