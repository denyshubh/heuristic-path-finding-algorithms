import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Path Finding Algorithms</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Algorithms" id="select-algo">
              <NavDropdown.Item href="/bfs">Dumb BFS</NavDropdown.Item>
              <NavDropdown.Item href="/dfs">Dumb DFS</NavDropdown.Item>
              <NavDropdown.Item href="/astar">A*</NavDropdown.Item>
              <NavDropdown.Item href="/dijkstra">Uniform Cost Search</NavDropdown.Item>
              <NavDropdown.Item href="/greedyBfs">Greedy BFS</NavDropdown.Item>
              <NavDropdown.Item href="/rrt">RRT</NavDropdown.Item>
              <NavDropdown.Item href="/rrtstar">RRT*</NavDropdown.Item>
              <NavDropdown.Item href="/thetastar">Theta*</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;