import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";

import { AUTH_TOKEN } from './constants'
import { ApolloLink } from 'apollo-client-preset'

import registerServiceWorker from "./registerServiceWorker";

import { BrowserRouter } from 'react-router-dom'
// 1
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

// 2
const httpLink = new HttpLink({ uri: "http://localhost:4000" });

// 3  
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  })
  return forward(operation)
})

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

// 4
ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
