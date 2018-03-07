import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';
import uuidv4 from 'uuid';

import SignPolicy from '../SignPolicy/SignPolicy';

// TODO: move?
function generateId() {
  // TODO: let this be done by sp?
  return uuidv4();
}

// TODO: move?
function addPolicy(policy, signature, service_provider) {
  const transaction_hash = generateId();
  const body = { transaction_hash, service_provider, policy, signature };
  const options = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  };
  return axios
    .post('/api/policy/new', body, options)
    .then(response => response.data);
}

class SignPolicyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signPolicyCompleted: false,
      signPolicyFailed: false,
      attributesForSigning: [{
          label: 'Voorletters',
          attributes: ['irma-demo.idin.idin.initials'],
        },{
          label: 'Achternaam',
          attributes: ['irma-demo.idin.idin.familyname'],
        },{
          label: 'BSN',
          attributes: ['irma-demo.MijnOverheid.root.BSN'],
        }],
    };
  }

  componentDidMount() {
    // this._isMounted = true;
    // if (!this.state.sessionStarted) {
    this.fetchMessage();
    // }
  }

  onSigningComplete = (result) => {
    console.log('Succes: ', result);
    addPolicy(this.state.policy, { ...result }, this.getServiceProvider())
      .then(data => {
          this.setState({
            signPolicyCompleted: true,
          });

          // Use success handler if provided
          if (this.props.onAdd !== undefined) {
            this.props.onAdd(result.jwt);
          }
      })
      .catch(() => {
        this.setState({
          signPolicyFailed: true, // TODO: add formData
        });
      });
  };

  onSigningFailure = (result) => {
    console.log('Error: ', result);
  };

  getServiceProvider = () => {
    if (this.props.spId) {
      return this.props.spId;
    }
    return queryString.parse(this.props.location.search)['spId'];
  }

  fetchMessage = () => {
    const actorId = this.getServiceProvider();

    const policy = {
      actorId,
      action: "verwerken en onderling delen",
      actee: "mijn (persoonlijke) gegevens",
      conditions: [],
      goal: "het Huishoudboekje mijn Inkomsten en Vaste Lasten voor mij kan beheren"
    };
    const options = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    };
    axios
      .post('/api/policy/get-message-for-policy', policy, options)
      .then(response => response.data)
      .then(data => {
        // if (this._isMounted) {
          this.setState({
            message: data.message,
            policy: policy,
          });
        // }
      });
  }

  render() {
    const { message, attributesForSigning, signPolicyCompleted, signPolicyFailed } = this.state;

    if (signPolicyCompleted) {
      return (
        'Toestemming ingesteld! Je wordt nu doorgestuurd...'
      );
    }

    if (signPolicyFailed) {
      return (
        'Er ging iets mis met het instellen van toestemmingen...'
      );
    }

    return message ? (
      <SignPolicy
        requiredAttributes={attributesForSigning}
        message={message}
        onComplete={this.onSigningComplete}
        onFailure={this.onSigningFailure}
      />
    ) : "Toestemmingverzoek wordt aangemaakt..."
  }

  componentDidUpdate() {
    // if (this.state.signPolicyCompleted) {
    //   this.props.history.push('/my-policies');
    // }
  }

}

SignPolicyPage.propTypes = {
  formData: PropTypes.object,
  spId: PropTypes.string,
  onAdd: PropTypes.func,
  onError: PropTypes.func,
}

export default withRouter(SignPolicyPage);