import { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { format } from 'date-fns';

import { Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, TextField, Button, FormControlLabel, Switch } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

import { logout as authLogout } from '../redux/actions/auth';
import { closeEditor, linkUpdated } from '../redux/actions/editor';

function getLinkName(namespace, link) {
    if (namespace === "globals") {
        return `${link} (top-level)`;
    }

    return `${`${namespace || ''}/`}${link}`;
}

const LinkEditor = (props) => {
    const [namespace, setNamespace] = useState("");
    const [shortCode, setShortCode] = useState("");
    const [enabled, setEnabled] = useState(true);
    const [redirectURL, setRedirectURL] = useState("");
    const [owner, setOwner] = useState({firstName: "You!", lastName:""});
    const [created, setCreation] = useState(formatDate(null));
    const [expiry, setExpiry] = useState(formatDate(null));
    const [expiryEnabled, setExpiryEnabled] = useState(false);

    useEffect(() => {
        setNamespace(props.editor.linkPrefill?.namespace || "");
        setShortCode(props.editor.linkPrefill?.shortCode || "");
        setEnabled(props.editor.linkPrefill?.enabled === undefined || props.editor.linkPrefill?.enabled === null ? true : props.editor.linkPrefill?.enabled);
        setRedirectURL(props.editor.linkPrefill?.redirectURL || "");
        setOwner(props.editor.linkPrefill?.owner || {firstName: "You!", lastName:""});
        setCreation(formatDate(props.editor.linkPrefill?.created));
        setExpiry(formatDate(props.editor.linkPrefill?.expiry));
        setExpiryEnabled(props.editor.linkPrefill?.expiry ? true : false);
    }, [props.editor.linkPrefill]);

    function formatDate(dateStr) {
        if (!dateStr) {
            return format(new Date(), "yyyy-MM-dd'T'HH:mm");
        }
        return format(new Date(dateStr), "yyyy-MM-dd'T'HH:mm");
    }

    function handleEditorExit() {
        props.closeEditor();
    }

    function handleEditorSubmit() {
        if (props.editor.linkPrefill) {
            axios.put(`${process.env.API_URL}/admin/link/${namespace}/${shortCode}`, {
                namespace,
                shortCode,
                enabled,
                redirectURL,
                owner: {
                    id: owner.id
                },
                created: new Date(created).toISOString(),
                expiry: expiryEnabled ? new Date(expiry).toISOString() : null
            }, {
                auth: {
                    username: props.auth.email,
                    password: props.auth.password
                }
            })
            .then(res => {
                props.linkUpdated();
                props.closeEditor();
            })
            .catch(err => {
                alert(err);
            });
        }
    }

    return (
        <Dialog open={props.open} onClose={handleEditorExit} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.editor.linkPrefill ? "Edit" : "Create new"} link {props.editor.linkPrefill ? (<strong>{getLinkName(props.editor.linkPrefill.namespace, props.editor.linkPrefill.shortCode)}</strong>) : ""}</DialogTitle>
            <DialogContent>
            <TextField
                margin="dense"
                style={{ marginRight: 8 }}
                id="namespace"
                label="Namespace"
                type="text"
                value={namespace}
                onChange={e => setNamespace(e.target.value)}
            />
            <TextField
                margin="dense"
                style={{ marginLeft: 8 }}
                id="shortCode"
                label="Short Code"
                type="text"
                value={shortCode}
                onChange={e => setShortCode(e.target.value)}
            />
            <FormControlLabel
                control={
                    <Switch
                        checked={enabled}
                        onChange={e => setEnabled(e.target.checked)}
                        name="enabled"
                        color="primary"
                    />
                }
                label="Enabled"
                labelPlacement="top"
            />
            <TextField
                margin="dense"
                id="redirectURL"
                label="Redirect URL"
                type="url"
                fullWidth
                value={redirectURL}
                onChange={e => setRedirectURL(e.target.value)}
            />
            <TextField
                margin="dense"
                id="created"
                label="Created"
                type="datetime-local"
                value={created}
                disabled={true}
            />
            <FormControlLabel
                control={
                    <Switch
                        checked={expiryEnabled}
                        onChange={e => setExpiryEnabled(e.target.checked)}
                        name="enabled"
                        color="primary"
                    />
                }
                label="Expires"
                labelPlacement="top"
            />
            <TextField
                margin="dense"
                id="expiry"
                label="Expires"
                type={expiryEnabled ? "datetime-local" : "text"}
                value={expiryEnabled ? expiry : "N/A"}
                onChange={e => setExpiry(e.target.value)}
                disabled={!expiryEnabled}
            />
            <TextField
                margin="dense"
                id="owner"
                label="Creator"
                type="text"
                value={`${owner.firstName} ${owner.lastName}`}
                disabled={true}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={handleEditorExit} color="primary">
                Cancel
            </Button>
            <Button onClick={handleEditorSubmit} color="primary" startIcon={<SaveIcon />}>
                {props.editor.linkPrefill ? "Save Changes" : "Create Link" }
            </Button>
            </DialogActions>
        </Dialog>
    )
}

function mapStateToProps(state) {
    const { auth, editor } = state
    return { auth, editor }
}
  
const mapDispatchToProps = {
    authLogout,
    closeEditor,
    linkUpdated
}
  
export default connect(mapStateToProps, mapDispatchToProps)(LinkEditor);