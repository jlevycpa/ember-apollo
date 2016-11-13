import Ember from 'ember';


export default Ember.Service.extend({
  init() {
    this._super(...arguments);
    const client = this.initApolloClient();
    this.set('client', client);
  },

  initApolloClient() {
    Ember.assert('You must override the initApolloClient() method in your apollo-client service. The method should return a valid ApolloClient instance');
  },

  watchQuery(options) {
    return this.get('client').watchQuery(options);
  },

  query(options) {
    return this.get('client').query(options);
  },

  mutate(options) {
    return this.get('client').mutate(options);
  }
});
