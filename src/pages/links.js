import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper,
 Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, TextField, Button, ButtonGroup, Link as MaterialLink } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { logout as authLogout } from '../redux/actions/auth';
import { openEditor, closeEditor, changeEditorPrefill, updateHandled } from '../redux/actions/editor';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { format } from 'date-fns';

import LinkEditor from '../components/editor';

require('dotenv').config();


function editLink(link, actionCreators) {
    actionCreators[0](link);
    actionCreators[1]();
}

function deleteLink(link) {
    
}

const TableButton = (props) => {
    return (
        <MaterialLink onClick={()=>props.func(props.link, props.actionCreators)} color={props.color}>{props.name}</MaterialLink>
    );
}

class LinksPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            linkData: [],
            loading: true
        }
    }

    formatDate(dateStr) {
        return format(new Date(dateStr), "M/d/yy H:mm:ss");
    }

    openDialog(link) {
        this.setState({
            editorOpen: true
        });
    }

    fetchData(callback = () => {}) {
        axios
            .get(`${process.env.API_URL}/admin/links`, {
                auth: {
                    username: this.props.auth.email,
                    password: this.props.auth.password
                }
            })
            .then(res => {
                this.setState({linkData: res.data});
                this.setState({loading: false});
                callback();
            })
            .catch(err => {
                this.props.authLogout(true);
                this.props.router.push('/login');
            });
    }
    
    componentDidMount() {
        if (!this.props.auth.isLoggedIn) {
            this.props.router.push("/login");
            return;
        }
        
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.editor.needToUpdate) {
            this.fetchData(() => {
                this.props.updateHandled();
            });
        }
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
                        <TableCell>Enabled</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.linkData.map((row) => (
                        <TableRow key={row.namespace + '/' + row.shortCode}>
                            <TableCell>{row.namespace}</TableCell>
                            <TableCell>{row.shortCode}</TableCell>
                            <TableCell>{row.redirectURL}</TableCell>
                            <TableCell>{row.owner ? row.owner.firstName + " " + row.owner.lastName : "SYSTEM"}</TableCell>
                            <TableCell>{row.created && this.formatDate(row.created)}</TableCell>
                            <TableCell>{row.expiry && this.formatDate(row.expiry)}</TableCell>
                            <TableCell>{row.enabled ? "Y" : "N"}</TableCell>
                            <TableCell align="right">
                                <TableButton link={row} func={editLink} actionCreators={[this.props.changeEditorPrefill, this.props.openEditor]} color="primary" name="Edit"/> &nbsp;
                                <TableButton link={row} func={deleteLink} color="secondary" name="Remove"/> 
                            </TableCell>
                       </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
                <LinkEditor open={this.props.editor.editorOpen}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { auth, editor } = state
    return { auth, editor }
}
  
const mapDispatchToProps = {
    authLogout,
    openEditor,
    closeEditor,
    changeEditorPrefill,
    updateHandled
}
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LinksPage));