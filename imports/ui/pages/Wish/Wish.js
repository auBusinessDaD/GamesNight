import React from 'react';
import { Meteor } from 'meteor/meteor';
import Page from '../Page/Page';

const { productName } = Meteor.settings.public;

const content = `
Here at { productName }, we are on a journey to making a robust and modern management tool for finding and managing your tabletop/board games. This is your opportunity to influence that direction.

Complete the form below to let us know what you like to see in this web application.
`;

const Wish = () => (
  <div className="Wish">
    <Page
      title="Make a Wish"
      subtitle="Building for your future"
      content={content}
    />
  </div>
);

export default Wish;
