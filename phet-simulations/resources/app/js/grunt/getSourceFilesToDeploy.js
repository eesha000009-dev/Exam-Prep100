// Copyright 2022, University of Colorado Boulder

/**
 * Export a function that gets a list of source files to deploy.
 *
 * @author Liam Mulhall
 */

const fs = require( 'fs' );

/**
 * Returns a list of files to deploy depending on the platform provided to the function. Used by the deploy function.
 * We check to ensure the files exist.
 *
 * @param {String} platform - which platform we're deploying; valid options are all, mac, or windows
 * @returns {String[]} - list of files to deploy
 */
const getSourceFilesToDeploy = platform => {
  const sourceFilesToDeploy = [];
  const phetMacAppPath = `${__dirname}/../../build/dev/phet-mac-app.dmg`;
  const phetWindowsAppPath = `${__dirname}/../../build/dev/phet-windows-app.exe`;

  // add files to deploy
  if ( platform === 'mac' ) {

    // grab the mac .dmg file
    try {
      if ( fs.existsSync( phetMacAppPath ) ) {
        sourceFilesToDeploy.push( phetMacAppPath );
      }
      else {
        console.error( 'mac .dmg file doesn\'t exist' );
      }
    }
    catch( e ) {
      console.error( e );
    }
  }
  else if ( platform === 'windows' ) {

    // grab the windows .exe file
    try {
      if ( fs.existsSync( phetWindowsAppPath ) ) {
        sourceFilesToDeploy.push( phetWindowsAppPath );
      }
      else {
        console.error( 'windows .exe file doesn\'t exist' );
      }
    }
    catch( e ) {
      console.error( e );
    }
  }
  else if ( platform === 'all' ) {

    // grab the mac .dmg file and the windows .exe file
    try {
      if ( fs.existsSync( phetMacAppPath ) && fs.existsSync( phetWindowsAppPath ) ) {
        sourceFilesToDeploy.push( phetMacAppPath );
        sourceFilesToDeploy.push( phetWindowsAppPath );
      }
      else {
        console.error( 'mac .dmg file or windows .exe file doesn\'t exist' );
      }
    }
    catch( e ) {
      console.error( e );
    }
  }

  return sourceFilesToDeploy;
};

module.exports = getSourceFilesToDeploy;