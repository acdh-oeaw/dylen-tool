import React, {Component} from 'react';
import store from '../redux/store'
import {connect} from "react-redux";
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import {fetchNetworks} from '../redux/actions'

const mapStateToProps = (state) => {
  return {
    corpora: state.corpora.allAvailableCorpora,
    networks: state.networks
  };
};

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCorpusID: '',
      selectedSubcorpusID: '',
      selectedNetworkID: ''
    };
    this.changeSubcorpus = this.changeSubcorpus.bind(this);
    this.fetchNetwork = this.fetchNetwork.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.corpora !== this.props.corpora) {
      this.setState({selectedCorpusID: this.props.corpora[0].id});
      this.setState({selectedSubcorpusID: this.props.corpora[0].sources[0].id});
      this.setState({selectedNetworkID: this.props.corpora[0].sources[0].networks[0].id});
    }
  }

  changeSubcorpus(event) {
    this.setState({selectedSubcorpusID: event.target.value});
  }

  fetchNetwork() {
    store.dispatch(fetchNetworks(this.state.selectedNetworkID));
  }

  render() {
    let renderedCorpora = [];
    let renderedSubcorpora = [];
    let renderedNetworks = [];
    if(this.state.selectedSubcorpusID && this.state.selectedSubcorpusID && this.state.selectedSubcorpusID) {
      renderedCorpora = this.props.corpora.map(corpus => (
        <option value={corpus.id} key={corpus.id}>{corpus.name}</option>
      ))
      renderedSubcorpora = this.props.corpora[0].sources.map(subcorpus => (
        <option value={subcorpus.id} key={subcorpus.id}>{subcorpus.name}</option>
      ))
      let selectedSubcorpusObject = this.props.corpora[0].sources.filter(obj => {
        return obj.id === this.state.selectedSubcorpusID;
      });
      selectedSubcorpusObject = selectedSubcorpusObject[0];
      renderedNetworks = selectedSubcorpusObject.networks.map(network => (
        <option value={network.id} key={network.id}>{network.text}</option>
      ))
    }

    return (
      <Container>
        <Row>
          <Col>
            <h2>Search</h2>
            <Form>
              <Form.Group controlId="exampleForm.SelectCorpus">
                <Form.Label>Corpus:</Form.Label>
                <Form.Control as="select" custom>
                  {renderedCorpora}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="exampleForm.SelectSubcorpus">
                <Form.Label>Subcorpus:</Form.Label>
                <Form.Control as="select" custom onChange={this.changeSubcorpus}>
                  {renderedSubcorpora}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="exampleForm.SelectNetwork">
                <Form.Label>Target Word:</Form.Label>
                <Form.Control as="select" custom>
                  {renderedNetworks}
                </Form.Control>
              </Form.Group>
            </Form>
            <Button variant="primary" onClick={this.fetchNetwork}>Search</Button>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default connect(mapStateToProps)(Search);