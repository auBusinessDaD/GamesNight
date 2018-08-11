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
  
  .clickableText {
    cursor: pointer;
  }
  
  .sortableColumn {
    cursor: alias;
  }
`;

const handleAddOwn = (gameId) => {
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
          Bert.alert('Your wish, our command! So it be done!', 'success');
        }
      });
    }
  });
};

const handleAdd = (gameId, gameField) => {
  let addItem = { _id: gameId, field: gameField };
  Meteor.call('games.addFieldArray', addItem, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Your wish, our command! So it be done!', 'success');
    }
  });
};

const handleRemove = (gameId, gameField) => {
  let remItem = { _id: gameId, field: gameField };
  
  if (confirm('Are you sure? Like, REALLY sure!?!')) {
    Meteor.call('games.removeFieldArray', remItem, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Your wish our command! So it be done!', 'success');
      }
    });
  }
};

const sortTable = (tableHeader, sortType) => {
  let thisTable, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  thisTable = document.getElementById("gameTable");
  switching = true;
  
  dir = "asc";
  
  while (switching) {
    switching = false;
    rows = thisTable.rows;
    
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      
      x = rows[i].getElementsByTagName("TD")[tableHeader];
      y = rows[i + 1].getElementsByTagName("TD")[tableHeader];
      
      if (dir == "asc") {
        if (sortType == "text") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (sortType == "number") {
          if (Number(x.innerHTML) > Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      } else if (dir == "desc") {
        if (sortType == "text") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        } else if (sortType == "number") {
          if (Number(x.innerHTML) < Number(y.innerHTML)) {
            shouldSwitch = true;
            break;
          }
        }
      }
    };
    
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  };
};

const Games = ({
  loading, games, match, history,
}) => (!loading ? (
  <StyledGames>
    <div className="page-header clearfix">
      <h4 className="pull-left">My Itchlist</h4>
    </div>
    {games.length ?
      <Table responsive>
        <thead>
          <tr>
            <th className="sortableColumn" onClick={() => sortTable(0, "text")}>Title</th>
            <th className="sortableColumn" onClick={() => sortTable(1, "text")}>Edition</th>
            <th>Friends</th>
            <th>Friends again..</th>
            <th />
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
              <td><span className="clickableText" onClick={() => history.push(`${match.url}/${_id}`)}>{title}</span></td>
              <td>{edition}</td>
              <td>friends with game?</td>
              <td>friends who WTP</td>
              <td>
                { wishGame ?
                  <Button
                    bsStyle="danger"
                    onClick={() => handleRemove(_id, "wishlist")}
                    block
                  >
                    Remove from Wishlist
                  </Button>
                  : <Button
                    bsStyle="primary"
                    onClick={() => handleAdd(_id, "wishlist")}
                    block
                  >
                    Add to Wishlist
                  </Button> }
              </td>
              <td>
                { ownsGame ?
                  <Button
                    bsStyle="danger"
                    onClick={() => handleRemove(_id, "owns")}
                    block
                  >
                    Remove from shelf
                  </Button>
                  : <Button
                    bsStyle="primary"
                    onClick={() => handleAddOwn(_id)}
                    block
                  >
                    Add to Shelf
                  </Button> }
              </td>
              <td>
                <Button
                  bsStyle="danger"
                  onClick={() => handleRemove(_id, "wantPlay")}
                  block
                >
                  X
                </Button>
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
          onClick: () => history.push('${match.url}/new'),
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
  const gamesArray = GamesCollection.find({ wantPlay: Meteor.userId() }).fetch();
  
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
