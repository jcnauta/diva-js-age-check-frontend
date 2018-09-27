import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import Button from 'material-ui/RaisedButton';
import { actions } from '../../reducers/session-reducer';

const centerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}

class MyHome extends Component {

  render() {
    const { over18s, photos, deauthenticate } = this.props;

    return (
      <div style={{ padding: '20px' }} id="my-home-page">
        <h2>Scanresultaat</h2>
        <Row start="xs" xs={1}>
        <br />
        <br />
          <Col xs={4}>
            Ouder dan 18: { (over18s && over18s.length > 0) ? over18s[0] : 'Leeftijd niet vrijgegeven.'}<br />
          </Col>
        <br />
          <Col xs={4}>
            <img src={ (photos && photos.length > 0) ? "data:image/jpeg;base64," + photos[0] : undefined } width="200px" alt="Your photo" />
            <br />
          </Col>
        </Row>
        <br />
        <br />
        <Row xs={4} style={ centerStyle }>
          <Button onClick={deauthenticate} style={ {minWidth: 450, display: 'flex', align: 'center'} }>
            Volgende klant
          </Button>  
        </Row>
      </div>
    );
  }
}

MyHome.propTypes = {
  over18s: PropTypes.arrayOf(PropTypes.string).isRequired,
  photos: PropTypes.arrayOf(PropTypes.string).isRequired,
  deauthenticate: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  const { session } = state;
  return {
    over18s: session.attributes['irma-demo.MijnOverheid.ageLower.over18'],
    photos: session.attributes['irma-demo.irmages.photos.photo'],
  };
} 

const mapDispatchToProps = {
  getSessionData: actions.getSessionData,
  deauthenticate: actions.deauthenticate

};


export default connect(mapStateToProps, mapDispatchToProps)(MyHome);
