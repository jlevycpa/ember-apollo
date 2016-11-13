# Ember-apollo

Ember integration for the awesome [Apollo GraphQL Client](http://dev.apollodata.com/)

**Warning: This addon is a work in progress. It has not been tested and may not work!**

## Installation (not yet published on npm)

* `npm install <repository-url>`

You will also need to install peer dependencies
* `npm install --save-dev apollo-client graphql-tag`
* `ember install ember-browserify` (needed to use npm dependencies in the browser)

## Setup apollo-client service

* `ember generate service apollo-client`
* import and extend the ApolloService
* import ApolloClient
* override initApolloClient() and return an ApolloClient instance. See Apollo docs on [the ApolloClient constructor](http://dev.apollodata.com/core/apollo-client-api.html#apollo-client) and [network interfaces](http://dev.apollodata.com/core/network.html)
```
// app/services/apollo-client.js
import Ember from 'ember';
import ApolloClientService from 'ember-apollo/services/apollo-client';

// this is necessary to get around some limitations of ember-browserify
import ACImports from 'npm:apollo-client';
const {default: ApolloClient, createNetworkInterface} = ACImports;

//extend ApolloClientService, not Ember.Service
export default ApolloClientService.extend({

  // override this method to setup your network interface and return an ApolloClient instance.
  initApolloClient() {
    const net = createNetworkInterface({uri: 'http://my-graphql-server/gql'});
    return new ApolloClient({networkInterface: net});
  }
});
```

## Queries
ember-apollo is designed for you to run graphql queries in the model hook of your routes.
* Import and extend ApolloRoute
* Import the `graphql-tag` and use it to write your queries
* Use the `this.query` function to execute your query in the model hook
* ember-apollo with call ApolloClient.watchQuery under the hood and subscribe to any changes in the query results. Your model will be updated (triggering rerender) if any changes occur.
```
// app/routes/some-route.js
import Ember from 'ember';
import gql from 'npm:graphql-tag';
import ApolloRoute from 'ember-apollo/routes/apollo-route';

// create your query
const query = gql`
query Test 
{
  allFilms {
    edges {
      node {
        title
      }
    }
  }
}
`;

// extend ApolloRoute instead of Ember.Route
export default ApolloRoute.extend({
  // the apollo-client service is injected automatically
  
  model() {
    const options = {}; //any options that ApolloClient.watchQuery allows
    return this.query(query, options);
  }
 });
```

## Mutations
Mutations can be written in any action handler using the standard [ApolloClient API](http://dev.apollodata.com/core/apollo-client-api.html#ApolloClient\.mutate):
```
\\ some-route.js
...
const mutation = gql`
  mutation {
    ... your mutation here ...
  }
`;
...
apolloClient: Ember.service.inject(),
actions: {
  someAction() {
    const options = {}; //Any options that ApolloClient.mutate accepts
    this.get('apolloClient').mutate(mutation, options);  //returns a promise
  }
}
...
For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
