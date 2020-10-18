import React, {Component} from 'react';
import './App.css';
import {Container, Row, Col} from 'react-bootstrap';
import Sidebar from './components/Sidebar'

class App extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col md="2">
            <Sidebar/>
          </Col>
          <Col md="10">
            Results
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App;