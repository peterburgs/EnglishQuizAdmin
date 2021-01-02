import React, { useState } from "react";
import {
  Paper,
  TableContainer,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TablePagination,
  Button,
} from "@material-ui/core";
import { setLearnerIdToDisable, setLearnerIdToEnable } from "../LearnerSlice";
import useStyles from "./LearnerTable.styles";
import EnhancedToolbar from "../../../hoc/EnhancedTableToolbar/EnhancedTableToolbar";
import EnhancedTableHead from "../../../components/EnhancedTableHead/EnhancedTableHead";
import { withStyles } from "@material-ui/core/styles";
import SimpleBar from "simplebar-react";
import { useDispatch } from "react-redux";

const StyledTableRow = withStyles(() => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: `rgba(26, 115, 232, 0.1)`,
    },
  },
}))(TableRow);

const LearnerTable = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const headCells = [
    {
      id: "#",
      label: "#",
    },
    {
      id: "fullName",
      label: "Learner name",
    },
    {
      id: "email",
      isNumber: true,
      label: "email",
    },
    {
      id: "createdAt",
      label: "Created At",
    },
    {
      id: "actions",
      label: "Actions",
    },
  ];

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const createSortHandler = (property) => () => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, props.learners.length - page * rowsPerPage);

  return (
    <div className={classes.learnerTable}>
      <Paper className={classes.paper}>
        <EnhancedToolbar title={"Learners"}></EnhancedToolbar>
        <TableContainer>
          <SimpleBar style={{ maxHeight: "calc(40vh)" }}>
            <Table
              style={{
                minWidth: 700,
              }}
              stickyHeader
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onCreateSortHandler={createSortHandler}
                headCells={headCells}
                isAllowSort={true}
              />
              <TableBody>
                {stableSort(props.learners, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <StyledTableRow key={row._id} className={classes.row}>
                      <TableCell component="th" scope="row">
                        {rowsPerPage * page + index + 1}
                      </TableCell>
                      <TableCell align="left">{row.fullName}</TableCell>
                      <TableCell align="center">
                        {row.userCredential.email}
                      </TableCell>
                      <TableCell align="left">{row.createdAt}</TableCell>
                      <TableCell align="center">
                        {row.userCredential.isActive ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              dispatch(setLearnerIdToDisable(row._id))
                            }
                          >
                            Disable
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              dispatch(setLearnerIdToEnable(row._id))
                            }
                          >
                            Enable
                          </Button>
                        )}
                      </TableCell>
                    </StyledTableRow>
                  ))}
                {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={5} />
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </SimpleBar>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={props.learners.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default LearnerTable;
