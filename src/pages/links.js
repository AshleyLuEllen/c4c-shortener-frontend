import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Divider, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper,
 Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, TextField, Button, ButtonGroup, Link as MaterialLink } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { logout as authLogout } from '../redux/actions/auth';
import { openEditor, closeEditor, changeEditorPrefill } from '../redux/actions/editor';
import { connect } from 'react-redux';
import { withRouter } from 'next/router'
import { format } from 'date-fns'
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

        this.handleEditorExit = this.handleEditorExit.bind(this);
        this.handleEditorSubmit = this.handleEditorSubmit.bind(this);
    }

    formatDate(dateStr) {
        return format(new Date(dateStr), "M/d/yy H:mm:ss");
    }

    openDialog(link) {
        this.setState({
            editorOpen: true
        });
    }

    handleEditorExit() {
        this.props.closeEditor();
    }

    handleEditorSubmit() {
        this.props.closeEditor();
    }

    componentDidMount() {
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
                this.setState({linkData: res.data});
                this.setState({loading: false});
            })
            .catch(err => {
                this.props.authLogout();
                this.props.router.push('/login');
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
                <Dialog open={this.props.editor.editorOpen} onClose={this.handleEditorExit} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send updates
                        occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleEditorExit} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleEditorSubmit} color="primary" startIcon={<SaveIcon />}>
                        {this.state.editorNewLink ? "Create Link" : "Save Changes"}
                    </Button>
                    </DialogActions>
                </Dialog>
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
    changeEditorPrefill
}
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LinksPage));