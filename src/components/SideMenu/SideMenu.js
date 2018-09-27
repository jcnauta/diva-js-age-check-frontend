import React from 'react';
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconActionHome from 'material-ui/svg-icons/image/crop-free';
import IconSocialPerson from 'material-ui/svg-icons/social/person';
import IconAssignmentReturned from 'material-ui/svg-icons/action/assignment-returned';
import IconAddLocation from 'material-ui/svg-icons/maps/add-location';
import IconCreate from 'material-ui/svg-icons/content/create';

const SideMenu = () => {
  const style = {
    height: '100%',
    margin: 20,
  };
  return (
    <div>
      <Paper style={style} id="navigation-menu">
        <List>
          <Link to="/">
            <ListItem primaryText="Hoofdmenu" />
          </Link>
        </List>
        <Divider />
        <List>
          <Link to="/my-home">
            <ListItem primaryText="Scanner" leftIcon={<IconActionHome />} />
          </Link>
        </List>
      </Paper>
    </div>
  );
};

export { SideMenu as default };
