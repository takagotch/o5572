/**
 * Test routes
 */
const routes = [];

routes.push({
  method: 'GET',
  path: '/test',
  handler: ( request, reply ) => {
    reply( request.headers );
  }
});

routes.push({
  method: 'POST',
  path: '/test',
  handler: ( request, reply ) => {
    reply( request.headers );
  }
});

module.exports = routes;
