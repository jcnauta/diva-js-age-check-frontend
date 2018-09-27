import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import IconSocialPerson from 'material-ui/svg-icons/social/person';
import MenuItem from 'material-ui/MenuItem';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { WithSimpleDivaAuthorization, WithDivaAuthorization } from 'diva-react';

import SideMenu from '../../components/SideMenu/SideMenu';

import Home from '../../containers/Home/Home';
import MyAccount from '../../containers/MyAccount/MyAccount';
import MyHome from '../../containers/MyHome/MyHome';
import UserInfo from '../../containers/UserInfo/UserInfo';
import SignPage from '../SignPage/SignPage';
import IssueCredentialsPage from '../IssueCredentialsPage/IssueCredentialsPage';
import IssueEanPage from '../IssueEanPage/IssueEanPage';

import './App.css';

import { actions } from '../../reducers/session-reducer';

const styles = {
  main: {
    minHeight: 200,
    margin: 20,
  },
};

class App extends Component {
  componentDidMount() {
    this.props.getSessionData();
  }

  deauthenticate() {
    this.props.deauthenticate();
  }

  render() {
    const {
      sessionId,
      attributes,
      error,
    } = this.props;

    const RightMenu = () => (
      <IconMenu
        id="user-menu"
        iconButtonElement={
          <IconButton id="navbar-user-icon">
            <IconSocialPerson style={{ color: 'red' }} />
          </IconButton>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <Link to="/">
          <MenuItem primaryText="About" />
        </Link>
        <MenuItem
          primaryText="Clear session"
          id="deauthenticate-button"
          onClick={() => this.deauthenticate()}
        />
      </IconMenu>
    );

    return (
      <BrowserRouter>
        <div>
          <AppBar
            title="Het Amsterdammertje: Onder de 18 geen druppel."
            iconElementRight={<RightMenu />}
          />
          { sessionId && (
            <Grid fluid>
              <Row>
                <Col xs={12} sm={3}>
                  <SideMenu />
                </Col>

                <Col xs>
                  <Paper style={styles.main} id="main-content">
                    <Route exact path="/" component={Home} />
                    <Route
                      path="/my-home"
                      component={WithDivaAuthorization(
                        attributes,
                        [
                          {
                            label: 'Ouder dan 18',
                            attributes: ['irma-demo.MijnOverheid.ageLower.over18'],
                          }, {
                            label: 'Pasfoto',
                            attributes: ['irma-demo.irmages.photos.photo'],
                          },
                        ],
                        'my-home-disclose',
                      )(MyHome)}
                    />
                    <Route path="/my-account" component={WithSimpleDivaAuthorization(attributes, 'pbdf.pbdf.email.email', 'Email')(MyAccount)} />
                    <Route path="/sign" component={SignPage} />
                    <Route path="/issue" component={IssueCredentialsPage} />
                    <Route
                      path="/issue-ean"
                      component={WithDivaAuthorization(
                        attributes,
                        [
                          {
                            label: 'iDin Address',
                            attributes: ['pbdf.pbdf.idin.address'],
                          }, {
                            label: 'iDin City',
                            attributes: ['pbdf.pbdf.idin.zipcode'],
                          },
                        ],
                        'issue-ean-disclose',
                      )(IssueEanPage)}
                    />
                  </Paper>
                </Col>
              </Row>
            </Grid>
          )}

          { error && (
            <div>
              <h3> Error: { error.reason } </h3>
              <i> { error.response.data } </i>
            </div>
          )}

          { !sessionId && !error && (
            <div> Loading </div>
          )}
        </div>
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  sessionId: PropTypes.string,
  attributes: PropTypes.objectOf(PropTypes.array),
  getSessionData: PropTypes.func,
  deauthenticate: PropTypes.func,
  error: PropTypes.shape({
    reason: PropTypes.string,
    response: PropTypes.object,
  }),
};

const mapStateToProps = state => state.session;

const mapDispatchToProps = {
  getSessionData: actions.getSessionData,
  deauthenticate: actions.deauthenticate,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
