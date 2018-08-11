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
      <h4 className="pull-left">My Games</h4>
    </div>
    {games.length ?
      <Table id="gameTable" responsive>
        <thead>
          <tr>
            <th className="sortableColumn" onClick={() => sortTable(0, "text")}>Title</th>
            <th className="sortableColumn" onClick={() => sortTable(1, "text")}>Location</th>
            <th />
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {games.map(({
            _id, title, playGame
          }) => (
            <tr key={_id}>
              <td><span className="clickableText" onClick={() => history.push(`/games/${_id}`)}>{title}</span></td>
              <td>On Shelf OR Loaned to XXX</td>
              <td>
                <Button
                  bsStyle="primary"
                  onClick={() => history.push('/games/${_id}')}
                  block
                >
                  **Loan To**
                </Button>
              </td>
              <td>
                { playGame ?
                  <Button
                    bsStyle="danger"
                    onClick={() => handleRemove(_id, "wantPlay")}
                    block
                  >
                    Satiated Desire
                  </Button>
                  : <Button
                    bsStyle="primary"
                    onClick={() => handleAdd(_id, "wantPlay")}
                    block
                  >
                    Itching To Play
                </Button> }
              </td>
              <td>
                <Button
                  bsStyle="danger"
                  onClick={() => handleRemove(_id, "owns")}
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
        title="You're plum out of games, friend!"
        subtitle="Add some games to your collection below."
        action={{
          style: 'success',
          onClick: () => history.push('/games'),
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
  const gamesArray = GamesCollection.find({ owns: Meteor.userId() }).fetch();
  
  const gamesArrayMap = gamesArray.map( (game) => {
    const gamePlay = game ? game.wantPlay.indexOf( Meteor.userId() ) > -1 : false;
    
    return {
      ...game,
      playGame: gamePlay ? true : false,
    };
  } );
  
  return {
    loading: !subscription.ready(),
    games: gamesArrayMap,
  };
})(Games);
