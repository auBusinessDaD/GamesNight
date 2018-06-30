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

const handleAddOwn = (gameId) => {//should we remove from wishlist if they have marked as owned?
  let addOwn = { _id: gameId, field: "owns" };
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

const handleAddWish = (gameId) => {
  let addOwn = { _id: gameId, field: "wishlist" };
  Meteor.call('games.addFieldArray', addOwn, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Game added to your wishlist!', 'success');
    }
  });
};

const handleRemoveOwn = (gameId) => {
  if (confirm('Are you sure? This will remove this game from your shelf!')) {
    let addOwn = { _id: gameId, field: "owns" };
    Meteor.call('games.removeFieldArray', addOwn, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Game removed from your shelf!', 'success');
      }
    });
  }
};

const handleRemoveWish = (gameId) => {
  let addOwn = { _id: gameId, field: "wishlist" };
  if (confirm('Are you sure? This will remove this game from your shelf!')) {
    Meteor.call('games.removeFieldArray', addOwn, (error) => {
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
            <th>Edition</th>
            <th>Year Published</th>
            <th>Publisher</th>
            <th>RRP</th>
            <th />
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {games.map(({
            _id, title, rrp, edition, pubYear, publisher, wishGame, ownsGame
          }) => (
            <tr key={_id}>
              <td>{title}</td>
              <td>{edition}</td>
              <td>{pubYear}</td>
              <td>{publisher}</td>
              <td>{rrp}</td>
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
                { wishGame ?
                  <Button
                    bsStyle="danger"
                    onClick={() => handleRemoveWish(_id)}
                    block
                  >
                    Remove from my Wishlist
                  </Button>
                  : <Button
                    bsStyle="primary"
                    onClick={() => handleAddWish(_id)}
                    block
                  >
                    Add to my Wishlist
                  </Button> }
              </td>
              <td>
                { ownsGame ?
                  <Button
                    bsStyle="danger"
                    onClick={() => handleRemoveOwn(_id)}
                    block
                  >
                    Remove from my shelf
                  </Button>
                  : <Button
                    bsStyle="primary"
                    onClick={() => handleAddOwn(_id)}
                    block
                  >
                    Add to my Shelf
                  </Button> }
              </td>
            </tr>
          ))}
        </tbody>
      </Table> : <BlankState
        icon={{ style: 'solid', symbol: 'file-alt' }}
        title="We're plum out of games to find, friend!"
        subtitle="Add a game for everyone to find by clicking the button below."
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
  const gamesArray = GamesCollection.find().fetch();
  
  const gamesArrayMap = gamesArray.map( (game) => {
    const gameWished = game ? game.wishlist.indexOf( Meteor.userId() ) > -1 : false;
    const gameOwned = game ? game.owns.indexOf( Meteor.userId() ) > -1 : false;
    
    return {
      ...game,
      wishGame: gameWished ? true : false,
      ownsGame: gameOwned ? true : false,
    };
  } );
  
  return {
    loading: !subscription.ready(),
    games: gamesArrayMap,
  };
})(Games);
