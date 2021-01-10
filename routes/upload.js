/**
 * Default home route
 */
const fs = require( 'fs' );
const Path = require( 'path' );
const Boom = require( 'boom' );

module.exports = {
  method: 'POST',
  path: '/upload',
  config: {

    payload: {
      output: 'stream',
      allow: 'multipart/form-data',
      parse: true,
    },

    handler: ( request, reply ) => {
      let data = request.payload;

      if ( !data.file || !data.file.hapi || !data.file.hapi.filename ) {
        return reply( Boom.badRequest( 'Must send a valid file to be saved.' ) );
      }
      let name = String( data.file.hapi.filename ).trim().replace( /[^\w\.]+/gi, '_' );
      let savePath = '/uploads/'+ name;
      let fullPath = Path.join( __dirname, '../', '/public/uploads', name );
      let file = fs.createWriteStream( fullPath );

      file.on( 'error', ( err ) => {
        return reply( err );
      });

      data.file.on( 'end', ( err ) => {
        if ( err ) {
          return reply( err );
        }
        return reply({
          status: 'ok',
          message: 'File saved successfully.',
          path: savePath,
        });
      });
      data.file.pipe( file );
    }
  }
};
