// Copyright 2020, University of Colorado Boulder
/**
 * Primary script responsible for notarizing build artifact on macOS platforms. This is a standard setup as described in
 * https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/.
 */
require( 'dotenv' ).config();
const jsonfile = require( 'jsonfile' );
const { notarize } = require( 'electron-notarize' ); // eslint-disable-line require-statement-match

// constants
const CONFIG_FILENAME = 'weddell-config.json';
const CONFIG = jsonfile.readFileSync( `${process.env.HOME}/.phet/${CONFIG_FILENAME}` );

exports.default = async function notarizing( context ) {
  const { electronPlatformName, appOutDir } = context;

  // We only notarize for macOS builds
  if ( electronPlatformName !== 'darwin' ) {
    return null;
  }
  const appName = context.packager.appInfo.productFilename;
  return notarize( {
    appBundleId: CONFIG.appBundleId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: CONFIG.appleId,
    appleIdPassword: CONFIG.appleIdPassword
  } );
};