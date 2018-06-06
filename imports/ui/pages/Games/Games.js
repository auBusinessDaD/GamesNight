import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import GamesCollection from '../../../api/Games/Games';
import { timeago, monthDayYearAtTime } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';
import BlankState from '../../components/BlankState/BlankState';

const StyledGames = styled.div`
  table tbody tr td {
    vertical-align: middle;
  }
`;

const handleAddOwn = (gameId) => {//should we remove from wishlist is they have marked as owned?
  Meteor.call('games.removeField', gameId, (error) => {//how do i pass through multiple parameters? need to pass through - gameId, 'owns' - to denote field it is working on
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Game added to your shelf!', 'success');
    }
  });
};

const handleRemoveOwn = (gameId) => {
  if (confirm('Are you sure? This will remove this game from your shelf!')) {
    Meteor.call('games.removeField', gameId, (error) => {//how do i pass through multiple parameters? need to pass through - gameId, 'owns' - to denote field it is working on
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Game added to your wishlist!', 'success');
      }
    });
  }
};

const handleAddWishlist = (gameId) => {
  Meteor.call('games.removeField', gameId, (error) => {//how do i pass through multiple parameters? need to pass through - gameId, 'owns' - to denote field it is working on
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Game removed from your shelf!', 'success');
    }
  });
};

const handleRemoveWishlist = (gameId) => {
  if (confirm('Are you sure? This will remove this game from your shelf!')) {
    Meteor.call('games.removeField', gameId, (error) => {//how do i pass through multiple parameters? need to pass through - gameId, 'owns' - to denote field it is working on
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Game removed from your wishlist!', 'success');
      }
    });
  }
};

const Games = ({
  loading, games, match, history,
}) => (!loading ? (
  <StyledGames>
    <div className="page-header clearfix">
      <h4 className="pull-left">Games</h4>
    </div>
    {games.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Last Updated</th>
            <th>Created</th>
            <th />
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {games.map(({
            _id, title, createdAt, updatedAt,
          }) => (
            <tr key={_id}>
              <td>{title}</td>
              <td>{timeago(updatedAt)}</td>
              <td>{monthDayYearAtTime(createdAt)}</td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => history.push(`${match.url}/${_id}`)}
                  block
                >
                  View
                </Button>
              </td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => handleAddOwn(_id)}
                  block
                >
                  I own this game - change if I already own to - remove from my shelf
                </Button>
              </td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => handleAddWishlist(_id)}
                  block
                >
                  Add to wishlist - change if it is on my wishlist to - remove from wishlist
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <BlankState
        icon={{ style: 'solid', symbol: 'file-alt' }}
        title="You're plum out of games to find, friend!"
        subtitle="Add your first game by clicking the button below."
        action={{
          style: 'success',
          onClick: () => history.push(`${match.url}/new`),
          label: 'Create Your First Game',
        }}
      />}
  </StyledGames>
) : <Loading />);

Games.propTypes = {
  loading: PropTypes.bool.isRequired,
  games: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  const subscription = Meteor.subscribe('games');
  return {
    loading: !subscription.ready(),
    games: GamesCollection.find().fetch(),
  };
})(Games);
