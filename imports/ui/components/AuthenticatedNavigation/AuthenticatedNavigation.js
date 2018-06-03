import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

const AuthenticatedNavigation = ({ name, history }) => (
  <div>
    <Nav>
    <LinkContainer to="/games">
      <NavItem eventKey={1} href="/games">All Games</NavItem>
    </LinkContainer>
      <LinkContainer to="/mine">
        <NavItem eventKey={2} href="/mine">My Games</NavItem>
      </LinkContainer>
      <LinkContainer to="/wishlist">
        <NavItem eventKey={3} href="/wishlist">My Wishlist</NavItem>
      </LinkContainer>
      <LinkContainer to="/game/manage">
        <NavItem eventKey={4} href="/game/manage">Manage Games</NavItem>
      </LinkContainer>
    </Nav>
    <Nav pullRight>
      <NavDropdown eventKey={5} title={name} id="user-nav-dropdown">
        <LinkContainer to="/profile">
          <NavItem eventKey={5.1} href="/profile">Profile</NavItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem eventKey={5.2} onClick={() => history.push('/logout')}>Logout</MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);

AuthenticatedNavigation.propTypes = {
  name: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(AuthenticatedNavigation);
