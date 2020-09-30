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
        console.log(this.props);
        if (!this.props.auth.isLoggedIn) {
            this.props.router.push("/login");
            return;
        }
        
        axios
            .get(`${process.env.API_URL}/admin/links`, {
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
            <div>
                <h1>Links</h1>
                {this.state.loading && <h2>Loading...</h2>}
                <Divider/>
                <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Namespace</TableCell>
                        <TableCell>Short&nbsp;Code</TableCell>
                        <TableCell>Redirect&nbsp;URL</TableCell>
                        <TableCell>Creator</TableCell>
                        <TableCell>Creation&nbsp;Date</TableCell>
                        <TableCell>Expiry&nbsp;Date</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.linkData.map((row) => (
                        <TableRow key={row.namespace + '/' + row.shortCode}>
                            <TableCell>{row.namespace}</TableCell>
                            <TableCell>{row.shortCode}</TableCell>
                            <TableCell>{row.redirectURL}</TableCell>
                            <TableCell>{row.owner}</TableCell>
                            <TableCell>{row.created}</TableCell>
                            <TableCell>{row.expiry}</TableCell>
                            <TableCell align="right">
                                Edit
                                Delete
                            </TableCell>
                       </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </div>
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