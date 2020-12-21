import { Snackbar, IconButton, Paper, TextField } from "@material-ui/core";
import React, { useState } from "react";
import useStyles from "./Auth.styles";
import authBackground from "../../assets/images/auth-background.svg";
import CloseIcon from "@material-ui/icons/Close";
import { useForm } from "react-hook-form";

const Auth = () => {
  const classes = useStyles();

  const [authError, setAuthError] = useState(null);
  const { register, handleSubmit, errors } = useForm();

  return (
    <div className={classes.auth}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={authError ? true : false}
        autoHideDuration={6000}
        onClose={() => setAuthError(null)}
        message={authError}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setAuthError(null)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <img
        className={classes.image}
        alt="auth-background"
        src={authBackground}
      />
      <Paper className={classes.form}>
        <form>
          <TextField
            id="email"
            name="email"
            autoComplete="off"
            inputRef={register({ required: true })}
            label="Email"
            variant="outlined"
            defaultValue={""}
            className={classes.formElement}
            error={Boolean(errors.email)}
            helperText={errors.email ? "*This field is required" : null}
          />
          <TextField
            id="password"
            name="password"
            type="password"
            autoComplete="off"
            inputRef={register({ required: true })}
            label="Email"
            variant="outlined"
            defaultValue={""}
            className={classes.formElement}
            error={Boolean(errors.email)}
            helperText={errors.email ? "*This field is required" : null}
          />
        </form>
      </Paper>
    </div>
  );
};

export default Auth;
