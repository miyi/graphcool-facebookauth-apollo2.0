import React from 'react'
import { Component } from 'react';
import ReactDOM from 'react-dom'
import App from './components/App'
import CreatePost from './components/CreatePost'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'tachyons'

//apollo@1
// import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo'

//apollo@2
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';


// const networkInterface = createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/cj9uusqtdeoev0174b3o5z910' })
// networkInterface.use([{
//   applyMiddleware (req, next) {
//     if (!req.options.headers) {
//       req.options.headers = {}
//     }

//     // get the authentication token from local storage if it exists
//     if (localStorage.getItem('graphcoolToken')) {
//       req.options.headers.authorization = `Bearer ${localStorage.getItem('graphcoolToken')}`
//     }
//     next()
//   },
// }])
// const client = new ApolloClient({ networkInterface })

//Apollo2.0

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cj9uusqtdeoev0174b3o5z910' });
// const middlewareLink = new ApolloLink((operation, forward) => {
//   console.log('setting context header')
//   operation.setContext(context => ({
//     ...context,
//     headers: {
//       authorization: localStorage.getItem('graphcoolToken') || null
//     }
//   }));
//   return forward(operation)
// })

const middlewareLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('graphcoolToken')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
});

// use with apollo-client
const link = middlewareLink.concat(httpLink);
const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

ReactDOM.render((
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={App} />
          <Route exact path='/create' component={CreatePost} />
        </Switch>
      </BrowserRouter>
    </ApolloProvider>

  ),
  document.getElementById('root')
);
