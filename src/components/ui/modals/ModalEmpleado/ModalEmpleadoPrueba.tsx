import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { removeElementActive } from "../../../../redux/slices/TablaReducer";
import IEmpleadoPost from "../../../../types/Empleado";
import { EmpleadoService } from "../../../../services/EmpleadoService";
import useAuthToken from "../../../../hooks/useAuthToken";

const API_URL = import.meta.env.VITE_API_URL;

interface IModalEmpleado {
  getEmpleados: Function;
  openModal: boolean;
  setOpenModal: (state: boolean) => void;
}

export const ModalEmpleadoPrueba = ({
  getEmpleados,
  openModal,
  setOpenModal,
}: IModalEmpleado) => {
  const initialValues: IEmpleadoPost = {
    id: 0,
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    rol: "",
    fechaNacimiento: "",
    idSucursal: 0,
  };

  const [formValues, setFormValues] = useState<IEmpleadoPost>(initialValues);
  const [errors, setErrors] = useState<any>({});
  const getToken = useAuthToken();
  const empleadoService = new EmpleadoService(API_URL + "/empleado");
  const elementActive = useAppSelector((state) => state.tablaReducer.elementActive);
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (elementActive) {
      setFormValues(elementActive);
    } else if (openModal) {
      setFormValues(initialValues);
    }
  }, [elementActive, openModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formValues.nombre) newErrors.nombre = "Campo requerido";
    if (!formValues.apellido) newErrors.apellido = "Campo requerido";
    if (!formValues.email) newErrors.email = "Campo requerido";
    if (!formValues.rol) newErrors.rol = "Campo requerido";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const token = await getToken();
      try {
        if (elementActive) {
          const updatedValues: any = { rol: formValues.rol };
          await empleadoService.putSec(formValues.id, updatedValues, token);
        } else {
          if (!sucursalActual) {
            console.error("Error al obtener sucursalActual");
            return;
          }
          const newValues = { ...formValues, idSucursal: sucursalActual.id };
          await empleadoService.postSec(API_URL + "/empleado", newValues, token);
        }
        getEmpleados();
        handleClose();
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
      }
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    dispatch(removeElementActive());
  };

  return (
    <div>
      <Modal
        id={"modal"}
        show={openModal}
        onHide={handleClose}
        size={"lg"}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{elementActive ? "Editar un Empleado:" : "Añadir un Empleado:"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {!elementActive && (
              <>
                <Form.Group>
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formValues.nombre}
                    onChange={handleChange}
                    isInvalid={!!errors.nombre}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={formValues.apellido}
                    onChange={handleChange}
                    isInvalid={!!errors.apellido}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.apellido}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formValues.telefono}
                    onChange={handleChange}
                    isInvalid={!!errors.telefono}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.telefono}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Correo Electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaNacimiento"
                    value={formValues.fechaNacimiento}
                    onChange={handleChange}
                    isInvalid={!!errors.fechaNacimiento}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fechaNacimiento}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}
            <Form.Group>
              <Form.Label>Tipo de Empleado</Form.Label>
              <Form.Control
                as="select"
                name="rol"
                value={formValues.rol}
                onChange={handleChange}
                isInvalid={!!errors.rol}
              >
                <option value="">Selecciona un tipo</option>
                <option value="ADMIN">Admin</option>
                <option value="COCINERO">Cocinero</option>
                <option value="CAJERO">Cajero</option>
                <option value="EMPLEADO">Empleado</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.rol}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="success" type="submit">
                Enviar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
