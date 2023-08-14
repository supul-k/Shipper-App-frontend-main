import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useCircularStyles = makeStyles((theme) => ({
   
  bottom: {
    color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  top: {
    color: "#1a90ff",
    animationDuration: "550ms",
   },
  circle: {
    strokeLinecap: "round",
  },
}));

const Component = (props: JSX.IntrinsicAttributes & import("@material-ui/core/CircularProgress").CircularProgressProps): JSX.Element => {
  const classes = useCircularStyles();

  return (
       <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
        {...props}
      />
   );
};

export default function CircularProgressComponent(): JSX.Element {
  return <Component />;
}
