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
  alignItems: 'center',
}

class MyHome extends Component {

  render() {
    const { over18s, photos, deauthenticate } = this.props;

    const isEighteen = over18s && over18s.length > 0 && over18s[0] === 'yes';

    return (
      <div style={{ padding: '20px', backgroundColor: isEighteen ? 'rgba(255, 255, 255, 0.8)' : 'rgba(200, 0, 0, 0.8)' }}  id="my-home-page">
        <h2>Scanresultaat</h2>
        <Row start="xs" xs={1} style={ {display: 'flex', justifyContent: 'center'} }>
        <br />
        <br />
          <Col xs={2} />
          <Col xs={4} style={{fontSize: '28px', paddingTop: '30px'}}>
            { isEighteen ? <div>Klant meerderjarig <img src="check.png" height="200"/></div> : (!over18s || over18s.length === 0 ? 'Leeftijd niet vastgesteld' : 'Klant minderjarig')}
          </Col>
          <Col xs={4}>
            <img src={ (photos && photos.length > 0) ? "data:image/jpeg;base64," + photos[0] : undefined } width="200px" style={centerStyle} />
            <br />
          </Col>
        </Row>
        <br />
        <br />
        <Row xs={4} style={ {padding: '40px', ...centerStyle} }>
          <Button onClick={deauthenticate} style={ {minWidth: '300px',...centerStyle} }>
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
