import React from 'react';
import { Meteor } from 'meteor/meteor';
import Page from '../Page/Page';

const { productName } = Meteor.settings.public;

const content = `
We are on a journey to making a robust and modern management tool for board games. This is your opportunity to influence that direction.

Complete the form below to let us know what you like to see in this web application.
`;

const Terms = () => (
  <div className="Terms">
    <Page
      title="Our Terms of Service"
      subtitle="Last updated May 4th, 2018"
      content={content}
    />
  </div>
);

export default Terms;
