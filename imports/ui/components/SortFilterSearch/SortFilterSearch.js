import React from 'react';
import PropTypes from 'prop-types';

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

const searchTable = (fieldID, tableHeader) => {
  let input, filter, thisTable, rows, td, i;
  input = document.getElementById(fieldID);
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
