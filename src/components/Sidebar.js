import React, {Component} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import MenuNavigation from './MenuNavigation';
import ActiveSearchItems from './ActiveSearchItems';
import SearchForm from './SearchForm';

class Sidebar extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col>
            DYLEN
          </Col>
        </Row>
        <MenuNavigation/>
        <ActiveSearchItems/>
        <SearchForm/>
      </Container>
    )
  }
}

export default Sidebar;