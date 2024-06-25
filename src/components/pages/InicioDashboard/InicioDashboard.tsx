import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faUtensils,
  faTags,
  faList,
  faCocktail,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Inicio.module.css";

export const InicioDashboard = () => {
  const user = JSON.parse(sessionStorage.getItem("usuario") || "null");

  return (
    <Container fluid className="inicio-dashboard">
      <Row className="justify-content-center mt-4">
        <Col className="animated-title" xs="auto">
          <h1 >Bienvenido {user.nickname}!</h1>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
      
        <Col md={6} lg={4} className="mb-4">
        <Link to="/estadistica" className="text-decoration-none">
          <Card
            className="text-center clickable-card"
          >
            <Card.Body>
              <Card.Title>Estadisticas</Card.Title>
              <FontAwesomeIcon
                icon={faChartPie}
                size="3x"
                className="mb-3"
              />
              <Card.Text>Visualiza las estadisticas de tu negocio.</Card.Text>
            </Card.Body>
          </Card>
          </Link>
        </Col>
        <Col md={6} lg={4} className="mb-4">
        <Link to="/insumos" className="text-decoration-none">
          <Card
            className="text-center clickable-card"
          >
            <Card.Body>
              <Card.Title>Insumos</Card.Title>
              <FontAwesomeIcon icon={faCocktail} size="3x" className="mb-3" />
              <Card.Text>Ver todos los insumos.</Card.Text>
            </Card.Body>
          </Card>
          </Link>
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
    </Container>
  );
};
