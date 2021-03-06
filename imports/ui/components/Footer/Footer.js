import React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import styled from 'styled-components';
import { Meteor } from 'meteor/meteor';
import { year } from '../../../modules/dates';

const StyledFooter = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-top: 1px solid var(--gray-lighter);
  padding: 20px 0;

  p {
    color: var(--gray-light);
    font-size: 14px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  ul li {
    float: left;
    margin-right: 15px;

    &:last-child {
      margin-right: 0px;
    }

    a {
      color: var(--gray-light);
    }

    a:hover,
    a:active,
    a:focus {
      text-decoration: none;
      color: var(--gray);
    }
  }

  @media screen and (min-width: 768px) {
    ul li {
      margin-right: 30px;
      
      &:last-child {
        margin-right: 0px;
      }
    }
  }
`;

const { productName, copyrightStartYear } = Meteor.settings.public;
const copyrightYear = () => {
  const currentYear = year();
  return currentYear === copyrightStartYear ? copyrightStartYear : `${copyrightStartYear}-${currentYear}`;
};

const Footer = () => (
  <StyledFooter>
    <Grid>
      <p className="pull-left">&copy; {copyrightYear()}<span className="hidden-xs"> {productName}</span></p>
      <ul className="pull-right">
        <li><Link to="/terms">Our Terms<span className="hidden-xs"> of Service</span></Link></li>
        <li><Link to="/privacy">Our Privacy<span className="hidden-xs"> Policy</span></Link></li>
        <li><Link to="/wish"><span className="hidden-xs">Make a </span> Wish</Link></li>
      </ul>
    </Grid>
  </StyledFooter>
);

Footer.propTypes = {};

export default Footer;
