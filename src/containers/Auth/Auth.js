import {
  Snackbar,
  IconButton,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Button,
  Typography,
  FormHelperText,
  CircularProgress,
} from "@material-ui/core";
import React, { useState } from "react";
import useStyles from "./Auth.styles";
import authBackground from "../../assets/images/auth-background.svg";
import CloseIcon from "@material-ui/icons/Close";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { signin, signinRefreshed } from "./AuthSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const Auth = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { register, handleSubmit, errors, control } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const signinStatus = useSelector((state) => state.auth.signinStatus);
  const signinError = useSelector((state) => state.auth.signinError);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(signin(data));
      unwrapResult(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.auth}>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={signinError ? true : false}
        autoHideDuration={2000}
        onClose={() => dispatch(signinRefreshed())}
        message={signinError}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => dispatch(signinRefreshed())}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            id="email"
            name="email"
            autoComplete="off"
            inputRef={register({ required: true })}
            placeholder={"Email address"}
            variant="outlined"
            defaultValue={""}
            className={classes.formElement}
            error={Boolean(errors.email)}
            helperText={errors.email ? "*This field is required" : null}
          />
          <Controller
            name="password"
            control={control}
            defaultValue={""}
            rules={{ required: true }}
            render={(props) => (
              <FormControl className={classes.formElement} variant="outlined">
                <OutlinedInput
                  placeholder="Password"
                  error={Boolean(errors.password)}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={props.value}
                  onChange={(value) => props.onChange(value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />

                {errors.password && (
                  <FormHelperText error={Boolean(errors.password)}>
                    * This field is required
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />
          <div style={{ position: "relative" }}>
            <Button
              style={{
                width: "100%",
                paddingTop: "0.7rem",
                paddingBottom: "0.7rem",
                borderRadius: 8,
              }}
              variant="contained"
              color="primary"
              type="submit"
              disabled={signinStatus === "loading"}
            >
              <Typography
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  textTransform: "none",
                }}
              >
                Log In
              </Typography>
            </Button>
            {signinStatus === "loading" && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
          <div className={classes.credit}>
            <Typography
              color="primary"
              variant="h6"
              style={{ fontWeight: "bold" }}
            >
              English Quiz Admin
            </Typography>
          </div>
        </form>
      </Paper>
    </div>
  );
};

export default Auth;
