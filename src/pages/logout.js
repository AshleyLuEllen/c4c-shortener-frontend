import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core';
import { logout as authLogout } from '../redux/actions/auth';
import { connect } from 'react-redux';
import { withRouter } from 'next/router'
require('dotenv').config();

class LinksPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            linkData: [],
            loading: true
        }
    }

    componentDidMount() {        
        axios
            .get(`${process.env.API_URL}/logout`, {
                auth: {
                    username: this.props.auth.email,
                    password: this.props.auth.password
                }
            })
            .then(res => {
                this.setState({linkData: res.data})
                this.setState({loading: false})
            })
            .catch(err => {
                alert(err);
            });
    }
  
    render() {
        return (
            <h1>Logout</h1>
        );
    }
}

function mapStateToProps(state) {
    const { auth } = state
    return { auth }
}
  
const mapDispatchToProps = {
    authLogout
}
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LinksPage));