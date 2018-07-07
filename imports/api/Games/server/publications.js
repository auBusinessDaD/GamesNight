import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Games from '../Games';

Meteor.publish('games', function games() {
  return Games.find();
});

Meteor.publish('mygames', function games() {
  return Games.find({ own: this.userId });//will need to test to ensure it reutrns games that i own
  // what about games that have been thriftied
});

Meteor.publish('mywishlist', function games() {
  return Games.find({ wishlist: this.userId });//will need to test to ensure it reutrns games on my wishlist
});

Meteor.publish('myloans', function games() {
  return Games.find({ loaned: this.userId });//will need to test to ensure it reutrns games that i have loaned out - loaned.loaner
});

Meteor.publish('myborrows', function games() {
  return Games.find({ loaned: this.userId });//will need to test to ensure it reutrns games that i have borrowed - loaned.loanee
});

Meteor.publish('managegames', function games() {
  return Games.find({ own: this.userId });//this is actually just games that i punlish - will need publish for games I own
});

// Note: games.view is also used when editing an existing game.
Meteor.publish('games.view', (gameId) => {
  check(gameId, String);
  return Games.find({ _id: gameId });
});

Meteor.publish('games.edit', function gamesEdit(gameId) {
  check(gameId, String);
  return Games.find({ _id: gameId, owner: this.userId });
});
