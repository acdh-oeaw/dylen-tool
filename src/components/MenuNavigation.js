import React, {Component} from 'react';
import {Row, Col, ListGroup} from 'react-bootstrap';

class MenuNavigation extends Component {
  render() {
    return (
      <Row>
        <Col>
          <ListGroup>
            Query Type:
            <ListGroup.Item variant="success">Ego Networks</ListGroup.Item>
            <ListGroup.Item variant="light">General Networks</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    )
  }
}

export default MenuNavigation;