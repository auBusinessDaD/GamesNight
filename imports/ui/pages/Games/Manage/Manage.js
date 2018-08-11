import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import GamesCollection from '../../../../api/Games/Games';
import { timeago, monthDayYearAtTime } from '../../../../modules/dates';
import Loading from '../../../components/Loading/Loading';
import BlankState from '../../../components/BlankState/BlankState';

const StyledGames = styled.div`
  table tbody tr td {
    vertical-align: middle;
  }
  
  .clickableText {
    cursor: pointer;
  }
`;

const Games = ({
  loading, games, match, history,
}) => (!loading ? (
  <StyledGames>
    <div className="page-header clearfix">
      <h4 className="pull-left">Games</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Game</Link>
    </div>
    {games.length ?
      <Table responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Last Updated</th>
            <th>Created</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {games.map(({
            _id, title, createdAt, updatedAt,
          }) => (
            <tr key={_id}>
              <td><span class="clickableText" onClick={() => history.push(`${match.url}/${_id}`)}>{title}</span></td>
              <td>{timeago(updatedAt)}</td>
              <td>{monthDayYearAtTime(createdAt)}</td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => history.push(`${match.url}/${_id}/edit`)}
                  block
                >
                  Edit
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
    games: GamesCollection.find({ owner: Meteor.userId() }).fetch(),
  };
})(Games);
