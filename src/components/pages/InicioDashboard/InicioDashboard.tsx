import { useState } from "react";
import { PieChart } from "../../ui/charts/PieChart/PieChart";
import { VerticalBarChart } from "../../ui/charts/VerticalBarChart/VerticalBarChart";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faTachometerAlt,
  faUtensils,
  faTags,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Inicio.module.css";

export const InicioDashboard = () => {
  const user = JSON.parse(sessionStorage.getItem("usuario") || "null");
  const [showVerticalBarChart, setShowVerticalBarChart] = useState(false);
  const [showPieChart, setShowPieChart] = useState(false);

  return (
    <Container fluid className="inicio-dashboard">
      <Row className="justify-content-center mt-4">
        <Col className="animated-title" xs="auto">
          <h1 >Bienvenido {user.nickname}!</h1>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col md={6} lg={4} className="mb-4">
          <Card
            className="text-center clickable-card"
            onClick={() => setShowVerticalBarChart(!showVerticalBarChart)}
          >
            <Card.Body>
              <Card.Title>Dashboard</Card.Title>
              <FontAwesomeIcon
                icon={faTachometerAlt}
                size="3x"
                className="mb-3"
              />
              <Card.Text>Accede a tu panel de control.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card
            className="text-center clickable-card"
            onClick={() => setShowPieChart(!showPieChart)}
          >
            <Card.Body>
              <Card.Title>Ventas por categoría</Card.Title>
              <FontAwesomeIcon icon={faChartPie} size="3x" className="mb-3" />
              <Card.Text>Ver distribución de ventas por categoría.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Link to="/articulosManufacturados" className="text-decoration-none">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Productos</Card.Title>
                <FontAwesomeIcon icon={faUtensils} size="3x" className="mb-3" />
                <Card.Text>Ver todos los productos.</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Link to="/categorias" className="text-decoration-none">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Categorías</Card.Title>
                <FontAwesomeIcon icon={faList} size="3x" className="mb-3" />
                <Card.Text>Ver todas las categorías.</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Link to="/promociones" className="text-decoration-none">
            <Card className="text-center">
              <Card.Body>
                <Card.Title>Promociones</Card.Title>
                <FontAwesomeIcon icon={faTags} size="3x" className="mb-3" />
                <Card.Text>Ver promociones actuales.</Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        {showVerticalBarChart && (
          <Col md={12} className="mb-4">
            <Card className="text-center">
              <Card.Body>
                <VerticalBarChart
                  width={35}
                  heigth={40}
                  title="Ranking de productos"
                />
              </Card.Body>
            </Card>
          </Col>
        )}
        {showPieChart && (
          <Col md={12} className="mb-4">
            <Card className="text-center">
              <Card.Body>
                <PieChart width={35} heigth={40} title="Ventas por categoría" />
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};
