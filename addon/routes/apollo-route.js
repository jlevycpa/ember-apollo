import Ember from 'ember';

export default Ember.Route.extend({
  apolloClient: Ember.inject.service('apollo-client'),

  /**
    This is the earliest we can subscribe because we need to wait until the
    controller already exists at this.controller. That is not the case in the
    model hook.
  **/
  render(controller, model) {
    this._super(...arguments);
    this.subscribeToQuery();
  },

  deactivate() {
    this.unsubscribeFromQuery();
  },

  /**
    Intended to be used in the model hook of a route.
    model() {
      return this.query(myQuery);
    }
  **/
  query(query, options = {}) {
    if(this.observableQuery) {
      this.unsubscribeFromQuery();
    }
    const client = this.get('apolloClient');
    const observableQuery = client.watchQuery({query, ...options});
    this.set('observableQuery', observableQuery);
    return new Ember.RSVP.Promise((resolve, reject) => {
      observableQuery.result().then(
        (result) => {
          resolve(result.data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },

  subscribeToQuery() {
    const observableQuery = this.get('observableQuery');
    const controller = this.controller;
    const next = (results) => {
      const model = controller.get('model');
      if (! (results.data === model)) {
        Ember.set(controller, 'model', results.data);
      }
    };
    const querySubscription = observableQuery.subscribe({next});
    this.set('querySubscription', querySubscription);

    // Check to make sure that the result at the start of the subscription is
    // what has been rendered.
    const currentResult = observableQuery.currentResult();
    const model = controller.get('model');
    if (! (currentResult.data === model)) {
      Ember.set(controller, 'model', currentResult.data);
    }
  },

  unsubscribeFromQuery() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
      delete this.querySubscription;
    }
  }
});
