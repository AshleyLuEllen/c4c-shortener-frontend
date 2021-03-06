import React from 'react';
import { Provider } from 'react-redux';
import { buildStore } from '../redux/redux';
import { PersistGate } from 'redux-persist/integration/react'

import Head from 'next/head';
import { CssBaseline } from '@material-ui/core';
import { LinkShortenerThemeProvider } from '../util/theme';

import "./styles.css";

let initialState = {
    
};
let {store, persistor} = buildStore(initialState);

const FoodTruckApp = ({ Component, pageProps }) => {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <Provider store={ store }>
            <PersistGate loading={null} persistor={persistor}>
                <Head>
                    <title>My page</title>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                </Head>

                <LinkShortenerThemeProvider>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />

                    <Component {...pageProps} />
                </LinkShortenerThemeProvider>
            </PersistGate>
        </Provider>
    )


};

export default FoodTruckApp;