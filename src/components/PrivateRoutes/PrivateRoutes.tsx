import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import IEmpleado from "../../types/Dtos/EmpleadoDto/IEmpleado";
import { setSucursalActual } from "../../redux/slices/SucursalReducer";
import { setEmpresaActual } from "../../redux/slices/EmpresaReducer";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import { SucursalService } from "../../services/SucursalService";
import ISucursales from "../../types/Sucursales";

const API_URL = import.meta.env.VITE_API_URL;

interface RutaPrivadaProps {
    component: React.ComponentType;
    roles?: string[];
}

const RutaPrivada: React.FC<RutaPrivadaProps> = ({ component: Component, roles }) => {
    const dispatch = useDispatch();
    const [, setEmpleado] = useState<IEmpleado | null>(null);
    const [loading, setLoading] = useState(true);

    const userDataString = sessionStorage.getItem('usuario');
    const sucursalService = new SucursalService(API_URL + "/sucursal");

    //console.log("EMAIL",userDataString);
    

    useEffect(() => {
        const fetchEmpleado = async () => {
            if (userDataString) {
                const userData = JSON.parse(userDataString);

                if (!userData) {
                    setLoading(false);
                    return;
                }

                try {
                    const response = await fetch(`${API_URL}/empleado/findByEmail?email=${userData.email}`);
                    
                    console.log("RESPONSE EMPLEADO:", response);
                    
                    if (!response.status) {
                        throw new Error('Network response was not ok');
                    }
                    const empleadoData: IEmpleado = await response.json();
                    setEmpleado(empleadoData);
                    dispatch(setSucursalActual(empleadoData.sucursal));


                    const responseSucursal = await sucursalService.getById(empleadoData.sucursal.id) as ISucursales;

                    // Establecer la empresa de la sucursal en el estado global
                    /* dispatch(setEmpresaActual(responseSucursal.empresa));

                    const empresaActual = useAppSelector((state) => state.empresa.empresaActual);
                    const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);    
                    
                    sessionStorage.setItem("empresaActual", JSON.stringify(empresaActual));
                    sessionStorage.setItem("sucursalActual", JSON.stringify(sucursalActual)); */ //COMENTE ESTO PARA ERROR 

                    dispatch(setEmpresaActual(responseSucursal.empresa));

                    sessionStorage.setItem("empresaActual", JSON.stringify(responseSucursal.empresa));
                    sessionStorage.setItem("sucursalActual", JSON.stringify(empleadoData.sucursal));
                    
                } catch (error) {
                    console.error('Error fetching empleado:', error);
                }
            }
            setLoading(false);
        };

        fetchEmpleado();
    }, [API_URL, userDataString, dispatch]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userDataString) {
        return <Navigate to="/login" replace />;
    }

    const userData = JSON.parse(userDataString);
    const rol = userData["https://my-app.example.com/roles"][0];

    if (roles && !roles.includes(rol)) {
        return <Navigate to={`/inicio`} replace />;
    }
    
    return <Component />;
};

export default RutaPrivada;
