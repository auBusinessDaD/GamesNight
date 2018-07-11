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

const handleAdd = (gameId, fieldName) => {
  let addOwn = { _id: gameId, field: fieldName };
  Meteor.call('games.addFieldArray', addOwn, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      let removeOwn = { _id: gameId, field: "wishlist" };
      Meteor.call('games.removeFieldArray', removeOwn, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Game removed from your Wishlist and added to your shelf!', 'success');
        }
      });
    }
  });
};

const handleRemove = (gameId, fieldName) => {
  if (confirm('Are you sure? This will remove this game from your wishlist!')) {
    let removeOwn = { _id: gameId, field: fieldName };
    Meteor.call('games.removeFieldArray', removeOwn, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Game removed!', 'success');
      }
    });
  }
};

const Games = ({
  loading, games, match, history,
}) => (!loading ? (
  <StyledGames>
    <div className="page-header clearfix">
      <h4 className="pull-left">My Wishlist</h4>
    </div>
    {games.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Edition</th>
            <th />
            <th />
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {games.map(({
            _id, title, rrp, edition, pubYear
          }) => (
            <tr key={_id}>
              <td>{title}</td>
              <td>{edition}</td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => history.push(`/games/${_id}`)}
                  block
                >
                  View
                </Button>
              </td>
              <td>
                <Button
                  bsStyle="danger"
                  onClick={() => handleAdd(_id, "wishlist")}
                  block
                >
                  Remove
                </Button>
              </td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => handleAdd(_id, "wishlist")}
                  block
                >
                  Add to My Wishlist
                </Button>
              </td>
              <td>
                  <Button
                    bsStyle="primary"
                    onClick={() => handleAdd(_id, "owns")}
                    block
                  >
                    Add to My Shelf
                  </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <BlankState
        icon={{ style: 'solid', symbol: 'file-alt' }}
        title="You're plum out of games, friend!"
        subtitle="Add your first game by clicking the button below."
        action={{
          style: 'success',
          onClick: () => history.push(`${match.url}/manage`),
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
    games: GamesCollection.find({ wantPlay: Meteor.userId() }).fetch(),
  };
})(Games);
