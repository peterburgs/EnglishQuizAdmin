import React from "react";
import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";
import useStyles from "./EnhancedTableHead.styles";

const EnhancedTableHead = (props) => {
  const { isAllowSort, orderBy, order, onCreateSortHandler } = props;

  const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        {props.headCells.map((headCell) => (
          <TableCell
            style={{ borderBottom: "none" }}
            key={headCell.id}
            align={
              headCell.isNumber || headCell.id === "actions" ? "center" : "left"
            }
          >
            {isAllowSort && headCell.id !== "#" && headCell.id !== "actions" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={onCreateSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;
