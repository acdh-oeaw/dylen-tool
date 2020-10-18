import React, {Component} from 'react';
import {Row, Col, ListGroup} from 'react-bootstrap';

class ActiveSearchItems extends Component {
  render() {
    return (
      <Row>
        <Col>
          <ListGroup>
            Active Queries:
            <ListGroup.Item variant="success">Balkanroute / AMC / Falter</ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    )
  }
}

export default ActiveSearchItems;