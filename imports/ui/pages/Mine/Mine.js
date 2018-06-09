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

const handleRemoveOwn = (gameId) => {
  if (confirm('Are you sure? This will remove this game from your shelf!')) {
    let removeOwn = { _id: gameId, field: "owns" };
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
      <h4 className="pull-left">My Games</h4>
    </div>
    {games.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>RRP</th>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {games.map(({
            _id, title, rrp,
          }) => (
            <tr key={_id}>
              <td>{title}</td>
              <td>{rrp}</td>
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
                  onClick={() => handleRemoveOwn(_id)}
                  block
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <BlankState
        icon={{ style: 'solid', symbol: 'file-alt' }}
        title="You're plum out of games, friend!"
        subtitle="Add some games to your collection below."
        action={{
          style: 'success',
          onClick: () => history.push(`/games`),
          label: 'Find Some Games Here',
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
    games: GamesCollection.find({ owns: Meteor.userId() }).fetch(),
  };
})(Games);
