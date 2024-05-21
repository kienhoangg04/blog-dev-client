import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import PageRender from './PageRender';
import Header from './components/global/Header';
import Footer from './components/global/Footer';
import { Alert } from './components/alert/Alert';

import { refreshToken } from './redux/actions/authAction';

import { getCategories } from './redux/actions/categoryAction';
import { getHomeBlogs } from './redux/actions/blogAction';

import io from 'socket.io-client';

import SocketClient from './SocketClient';
import { API_URL } from './utils/config';

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getHomeBlogs());
        dispatch(getCategories());
        dispatch(refreshToken());
    }, [dispatch]);

    useEffect(() => {
        const socket = io(API_URL);
        dispatch({ type: 'SOCKET', payload: socket });
        return () => {
            socket.close();
        };
    }, [dispatch]);

    return (
        <div className="container">
            <SocketClient />
            <Header />
            <Alert />
            <Switch>
                <Route exact path="/" component={PageRender} />
                <Route exact path="/:page" component={PageRender} />
                <Route exact path="/:page/:slug" component={PageRender} />
            </Switch>
            <Footer />
        </div>
    );
}

export default App;
