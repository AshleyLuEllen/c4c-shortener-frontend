import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux'
import { login as authLogin, logout as authLogout } from '../redux/actions/auth';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { TextField, Card, CardContent, Button, Fade, CircularProgress } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
require('dotenv').config();

function LoginPage(props) {
    const router = useRouter();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentlySubmitting, setCurrentlySubmitting] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);

    function loginSuccessful() {
        dispatch(props.authLogin(email, password));
        router.push("/");
    }
  
    function validateForm() {
      return email.length > 0 && password.length > 0 && !currentlySubmitting;
    }
  
    function handleSubmit(event) {
        event.preventDefault();
        setCurrentlySubmitting(true);

        // Attempt Login
        axios
            .get(`${process.env.API_URL}/admin/basicauth`, {
                auth: {
                    username: email,
                    password: password
                }
            })
            .then(res => {
                loginSuccessful()
            })
            .catch(err => {
                dispatch(props.authLogout(false));
                setLoginFailed(true);
                setCurrentlySubmitting(false);
            });
    }
  
    return (
        <div>
            <Fade in={true}>
                <Card className="login-card">
                    <CardContent>
                        <h1>Login</h1>
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <TextField className="login-input" id="email" label="Email Address" variant="outlined" value={email} onChange={e => setEmail(e.target.value)}/>
                            <br/>
                            <TextField className="login-input" id="password" label="Password" type="password" variant="outlined" value={password} onChange={e => setPassword(e.target.value)}/>
                            <div className="button-progress-container">
                                <Button type="submit" label="Login" variant="contained" color="primary" disabled={!validateForm()}>Login</Button> 
                                {currentlySubmitting && <CircularProgress className="button-progress" size={24}/>}
                            </div>
                        </form> 
                        {loginFailed && <Fade className="login-failed-alert" in={true}>
                            <Alert severity="error">
                                <AlertTitle><strong>Login Failed</strong></AlertTitle>
                                Double-check your email and password.
                            </Alert>
                        </Fade>}
                        {props.auth.wasLoggedOut && <Fade className="login-failed-alert" in={true}>
                            <Alert severity="error">
                                <AlertTitle><strong>You were logged out</strong></AlertTitle>
                                This is likely just due to a long period of inactivity.
                            </Alert>
                        </Fade>}
                    </CardContent>
                </Card>
            </Fade>
        </div>
    );
}


function mapStateToProps(state) {
  const { auth } = state;
  return { auth };
}

const mapDispatchToProps = {
    authLogin,
    authLogout
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);