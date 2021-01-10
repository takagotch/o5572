/**
 * Web server
 */
const fs = require( 'fs' );
const Path = require( 'path' );
const Inert = require( 'inert' );
const Hapi = require( 'hapi' );

const routes = Path.join( __dirname, 'routes' );
const server = new Hapi.Server();

// setup connection
server.connection({
  host: 'localhost',
  port: Number( process.argv[2] || 3000 ),
});

// register static file handler
server.register( Inert, ( err ) => {
  if ( err ) throw err;

  // serve static files relative to the public folder
  server.route({
    method: 'GET',
    path: '/{file*}',
    handler: {
      directory: {
        path: Path.join( __dirname, 'public' ),
        listing: false,
      }
    }
  });

  // load in custom app routes from files
  fs.readdir( routes, {}, ( err, list ) => {
    if ( err ) throw err;

    for ( let file of list ) {
      if ( /\.js$/.test( file ) ) {

        // could be a single route object, or list of route objects
        let routeData = require( routes +'/'+ file );

        // list of routes...
        if ( Array.isArray( routeData ) ) {
          for ( let route of routeData ) {
            console.log( 'Registering route for:', route.method, route.path );
            server.route( route );
          }
          continue;
        }

        // single route...
        if ( typeof routeData === 'object' ) {
          console.log( 'Registering route for:', routeData.method, routeData.path );
          server.route( routeData );
          continue;
        }
      }
    }

    // ready, start the server
    server.start( ( err ) => {
      if ( err ) throw err;
      console.log( `Server running at: ${server.info.uri}` );
    });

  });
});




