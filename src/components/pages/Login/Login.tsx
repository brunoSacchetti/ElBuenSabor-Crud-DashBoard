
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";
import styles from "./Login.module.css";

export const Login = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className={styles.containerLogin}>
      <div className={styles.containerForm}>
        <span style={{ fontSize: "10vh" }} className="material-symbols-outlined">
          account_circle
        </span>
        <div>
          <h4 className="text-center">Dashboard "El Buen Sabor"</h4>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-2">
          <Button onClick={() => loginWithRedirect()} variant="primary">
            Iniciar Sesión
          </Button>
        </div>
        {isLoading && <div className="text-center mt-3">Cargando...</div>}
      </div>
    </div>
  );
};
