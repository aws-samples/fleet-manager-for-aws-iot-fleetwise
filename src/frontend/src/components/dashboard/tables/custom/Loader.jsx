import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      position: "fixed",
      top: 0,
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "1000"
    }
  })
);

export default function CircularIndeterminate() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
}
