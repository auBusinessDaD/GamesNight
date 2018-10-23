/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Games from './Games';
import handleMethodException from '../../modules/handle-method-exception';
import rateLimit from '../../modules/rate-limit';

Array.prototype.arrayRemove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Meteor.methods({
  'games.findOne': function gamesFindOne(gameId) {
    check(gameId, Match.OneOf(String, undefined));

    try {
      return Games.findOne(gameId);
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.insert': function gamesInsert(gam) {
    check(gam, {
      title: String,
      description: String,
      altTitle: String,
      rrp: String,
      edition: String,
      pubYear: String,
      players: String,
      optimalPlayers: Number,
      playTime: String,
      ageRange: String,
      designers: String,
      artists: String,
      publisher: String,
      kidFriendly: Boolean,
      expAvail: Boolean,
      expansion: Boolean,
      standalone: Boolean
    });
    
    gam[ 'wantPlay' ] = new Array();
    gam[ 'wishlist' ] = new Array();
    gam[ 'owns' ] = new Array();
    
    gam[ 'categories' ] = new Array();
    gam[ 'gameMech' ] = new Array();
    gam[ 'type' ] = new Array();
    
    try {
      if (Roles.userIsInRole(this.userId, ['admin','publisher'])) {
        return Games.insert( gam );
      }

      throw new Meteor.Error('403', 'Sorry, you need to be a publisher to do this.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.update': function gamesUpdate(gam) {
    check(gam, {
      _id: String,
      title: String,
      description: String,
      altTitle: String,
      rrp: String,
      edition: String,
      pubYear: String,
      players: String,
      optimalPlayers: Number,
      playTime: String,
      ageRange: String,
      designers: String,
      artists: String,
      publisher: String,
      kidFriendly: Boolean,
      expAvail: Boolean,
      expansion: Boolean,
      standalone: Boolean
    });
    
    //need to check if this user can edit this game!!
    try {
      const gameId = gam._id;
      const gamToUpdate = Games.findOne(gameId, { fields: { owner: 1 } });

      if (gamToUpdate.owner === this.userId) {
        Games.update(gameId, { $set: gam });
        return gameId;
      }

      throw new Meteor.Error('403', 'Apologies - you eager beaver - but you\'re not allowed to edit this game.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.addFieldArray': function gamesAddField( gam ) {
    check(gam, {
      _id: String,
      field: String,
    });

    try {
      const gameId = gam._id;
      
      Games.update(gameId, { $push: { [gam.field]: this.userId } });
      return gameId;

      throw new Meteor.Error('403', 'Apologies - we had some difficulties with your request.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.removeFieldArray': function gamesRemoveField( gam ) {
    check(gam, {
      _id: String,
      field: String,
    });

    try {
      const gameId = gam._id;
      
      Games.update(gameId, { $pull: { [gam.field]: this.userId } });
      return gameId;

      throw new Meteor.Error('403', 'Apologies - we had some difficulties with your request.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
  'games.remove': function gamesRemove(gameId) {
    check(gameId, String);
    
    //need to check if this user can delete this game!!
    try {
      const gamToRemove = Games.findOne(gameId, { fields: { owner: 1 } });

      if (gamToRemove.owner === this.userId) {
        return Games.remove(gameId);
      }

      throw new Meteor.Error('403', 'Apologies - you eager beaver - but you\'re not allowed to delete this game.');
    } catch (exception) {
      handleMethodException(exception);
    }
  },
});

rateLimit({
  methods: [
    'games.insert',
    'games.update',
    'games.addFieldArray',
    'games.removeFieldArray',
    'games.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
