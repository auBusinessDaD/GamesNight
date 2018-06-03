import React from 'react';
import { Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';

const NotFound = () => (
  <div className="NotFound">
    <h1>Oh No!</h1>
    <Alert bsStyle="danger">
      <p><strong>Error [404]</strong>: {Meteor.isClient ? window.location.pathname : ''} does not exist.</p>
    </Alert>
    <p>Don't worry, we have plenty of actual pages for you to visit.</p>
  </div>
);

export default NotFound;
