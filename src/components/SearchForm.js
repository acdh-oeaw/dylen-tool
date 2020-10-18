import React, {Component} from 'react';
import store from '../redux/store'
import {connect} from "react-redux";
import {fetchNetworks} from '../redux/actions'
import {Row, Col, Form, Button} from 'react-bootstrap';

const mapStateToProps = (state) => {
  return {
    availableQueryParams: state.availableQueryParams
  };
};

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCorpusID: '',
      selectedSubcorpusID: '',
      selectedNetworkID: ''
    };
    this.changeSubcorpus = this.changeSubcorpus.bind(this);
    this.fetchNetwork = this.fetchNetwork.bind(this);
    this.changeNetwork = this.changeNetwork.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.availableQueryParams !== this.props.availableQueryParams) {
      this.setState({selectedCorpusID: this.props.availableQueryParams[0].id});
      this.setState({selectedSubcorpusID: this.props.availableQueryParams[0].sources[0].id});
      this.setState({selectedNetworkID: this.props.availableQueryParams[0].sources[0].networks[0].id});
    }
  }

  changeSubcorpus(event) {
    this.setState({selectedSubcorpusID: event.target.value});
  }

  changeNetwork(event) {
    this.setState({selectedNetworkID: event.target.value});
  }

  fetchNetwork() {
    store.dispatch(fetchNetworks(this.state.selectedNetworkID));
  }

  render() {
    let renderedavailableQueryParams = [];
    let renderedSubavailableQueryParams = [];
    let renderedNetworks = [];
    if(this.state.selectedSubcorpusID && this.state.selectedSubcorpusID && this.state.selectedSubcorpusID) {
      renderedavailableQueryParams = this.props.availableQueryParams.map(corpus => (
        <option value={corpus.id} key={corpus.id}>{corpus.name}</option>
      ))
      renderedSubavailableQueryParams = this.props.availableQueryParams[0].sources.map(subcorpus => (
        <option value={subcorpus.id} key={subcorpus.id}>{subcorpus.name}</option>
      ))
      let selectedSubcorpusObject = this.props.availableQueryParams[0].sources.filter(obj => {
        return obj.id === this.state.selectedSubcorpusID;
      });
      selectedSubcorpusObject = selectedSubcorpusObject[0];
      renderedNetworks = selectedSubcorpusObject.networks.map(network => (
        <option value={network.id} key={network.id}>{network.text}</option>
      ))
    }
    return (
      <Row>
        <Col>
          New Query:
          <Form>
              <Form.Group controlId="exampleForm.SelectCorpus">
                <Form.Label>Corpus:</Form.Label>
                <Form.Control as="select" custom>
                  {renderedavailableQueryParams}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="exampleForm.SelectSubcorpus">
                <Form.Label>Subcorpus:</Form.Label>
                <Form.Control as="select" custom onChange={this.changeSubcorpus}>
                  {renderedSubavailableQueryParams}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="exampleForm.SelectNetwork">
                <Form.Label>Target Word:</Form.Label>
                <Form.Control as="select" custom onChange={this.changeNetwork}>
                  {renderedNetworks}
                </Form.Control>
              </Form.Group>
            </Form>
            <Button variant="primary" onClick={this.fetchNetwork}>Query</Button>
        </Col>
      </Row>
    )
  }
}

export default connect(mapStateToProps)(SearchForm);