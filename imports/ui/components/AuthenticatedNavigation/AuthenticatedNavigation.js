import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { Roles } from 'meteor/alanning:roles';

const AuthenticatedNavigation = ({ name, history, userId }) => (
  <div>
    <Nav>
      <LinkContainer to="/games">
        <NavItem eventKey={1} href="/games">All Games</NavItem>
      </LinkContainer>
      <LinkContainer to="/playlist">
        <NavItem eventKey={2} href="/playlist">My Itchlist</NavItem>
      </LinkContainer>
      <LinkContainer to="/wishlist">
        <NavItem eventKey={3} href="/wishlist">My Wishlist</NavItem>
      </LinkContainer>
      <LinkContainer to="/mine">
        <NavItem eventKey={4} href="/mine">My Games Shelf</NavItem>
      </LinkContainer>
      {Roles.userIsInRole(userId, 'publisher') ? <NavDropdown eventKey={5} title="Publisher" id="publisher-nav-dropdown">
        <LinkContainer to="/game/manage">
          <NavItem eventKey={5.1} href="/game/manage">Manage Games</NavItem>
        </LinkContainer>
        <LinkContainer exact to="/game/manage/new">
          <NavItem eventKey={5.2} href="/game/manage/new">Add Game</NavItem>
        </LinkContainer>
      </NavDropdown> : ''}
      {Roles.userIsInRole(userId, 'admin') ? <NavDropdown eventKey={6} title="Admin" id="admin-nav-dropdown">
        <LinkContainer exact to="/admin/users">
          <NavItem eventKey={6.1} href="/admin/users">Users</NavItem>
        </LinkContainer>
        <LinkContainer exact to="/admin/users/settings">
          <NavItem eventKey={6.2} href="/admin/users/settings">User Settings</NavItem>
        </LinkContainer>
      </NavDropdown> : ''}
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={7} title={name} id="user-nav-dropdown">
        <LinkContainer to="/profile">
          <NavItem eventKey={7.1} href="/profile">Profile</NavItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem eventKey={7.2} onClick={() => history.push('/logout')}>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(AuthenticatedNavigation);
