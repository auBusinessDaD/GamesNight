import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import Games from '../../api/Games/Games';

const gamesSeed = userId => ({
  collection: Games,
  environments: ['staging'],//['development', 'staging'],
  noLimit: true,
  modelCount: 5,
  model(dataIndex) {
    return {
      owner: userId,
      title: `Game #${dataIndex + 1}`,
      body: `This is the body of game #${dataIndex + 1}`,
    };
  },
});

//Roles.createRole('publisher');

seeder(Meteor.users, {
  environments: ['development', 'staging'],
  noLimit: true,
  data: [{
    email: 'admin@admin.com',
    password: 'password',
    profile: {
      name: {
        first: 'Andy',
        last: 'Warhol',
      },
    },
    roles: ['admin'],
    data(userId) {
      return gamesSeed(userId);
    },
  }],
  modelCount: 5,
  model(index, faker) {
    const userCount = index + 1;
    return {
      email: `user+${userCount}@test.com`,
      password: 'password',
      profile: {
        name: {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
        },
      },
      roles: ['user', 'publisher'],
      data(userId) {
        return gamesSeed(userId);
      },
    };
  },
});
