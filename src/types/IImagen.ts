import { Base } from "./Base";

export default interface IImagen extends Base<IImagen>{
    id: number;
    name: string;
    url: string;
}