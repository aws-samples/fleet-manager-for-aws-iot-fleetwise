/*********************************************************************************************************************
 *  Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.                                           *
 *                                                                                                                    *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance    *
 *  with the License. A copy of the License is located at                                                             *
 *                                                                                                                    *
 *      http://www.apache.org/licenses/LICENSE-2.0                                                                    *
 *                                                                                                                    *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES *
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions    *
 *  and limitations under the License.                                                                                *
 *********************************************************************************************************************/
import React from "react";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TablePagination from "@material-ui/core/TablePagination";

import PropTypes from "prop-types";
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';


const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));
function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {

    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon htmlColor={page === 0 ? "gray" : "white"} /> : <FirstPageIcon htmlColor={page === 0 ? "gray" : "white"} />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight htmlColor={page === 0 ? "gray" : "white"} /> : <KeyboardArrowLeft htmlColor={page === 0 ? "gray" : "white"} />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft htmlColor={page >= Math.ceil(count / rowsPerPage) - 1 ? "gray" : "white"} /> : <KeyboardArrowRight htmlColor={page >= Math.ceil(count / rowsPerPage) - 1 ? "gray" : "white"} />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon htmlColor={page >= Math.ceil(count / rowsPerPage) - 1 ? "gray" : "white"} /> : <LastPageIcon htmlColor={page >= Math.ceil(count / rowsPerPage) - 1 ? "gray" : "white"} />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};



const defaultFooterStyles = {
  root: {
    borderBottom: "none",
    fontFamily: "AmazonEmber !important",
  },
  cell: {
    padding: 0,
    display: "flex",
    border: "none",
    justifyContent: "flex-end"
  },
  pagination: {
    backgroundColor: "#171E2D",
    borderBottom: "none",
  },
  selectIcon: {
    color: "white",
  },

};

const CustomTablePagination = ({
  classes,
  count,
  page,
  rowsPerPage,
  onChangeRowsPerPage,
  onChangePage
}) => {



  return (
    <TableFooter style={{ backgroundColor: "#171E2D", height: "48px" }}>
      <TableRow
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >

        <TablePagination
          className={classes.cell}
          classes={{ root: classes.root, selectIcon: classes.selectIcon }}
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 15, 30]}
          labelRowsPerPage="Rows"
          colSpan={3}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}

        />
      </TableRow>
    </TableFooter>
  );
};

CustomTablePagination.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
};

export default withStyles(defaultFooterStyles, { name: "CustomTablePagination" })(
  CustomTablePagination
);
