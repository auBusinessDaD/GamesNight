import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '../Icon/Icon';

const StyledSearchInput = styled.div`
  position: relative;

  i {
    position: absolute;
    left: 12px;
    top: 10px;
    color: var(--gray-light);
  }

  .form-control {
    padding-left: 30px;
  }
`;


const searchTable = (tableHeader) => {
  let input, filter, thisTable, rows, td, i;
  input = document.getElementById("searchGame");
  filter = input.value.toUpperCase();
  thisTable = document.getElementById("gameTable");
  rows = thisTable.getElementsByTagName("TR");

  for (i = 0; i < rows.length; i++) {
    td = rows[i].getElementsByTagName("TD")[tableHeader];
    
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  }
}

const SearchInput = ({ placeholder }) => (
  <StyledSearchInput id="searchGame" className="SearchInput">
    <Icon iconStyle="solid" icon="search" />
    <input
      type="text"
      name="search"
      className="form-control"
      placeholder={placeholder}
      onKeyUp={() => searchTable(0)}
    />
  </StyledSearchInput>
);

SearchInput.defaultProps = {
  placeholder: 'Search...',
};

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  onKeyUp: PropTypes.func.isRequired,
};

export default SearchInput;
