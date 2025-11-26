// Copyright 2022, University of Colorado Boulder

/**
 * Export a script that gets sims and sim metadata.
 *
 * @author Liam Mulhall
 */

const download = require( 'download' );
const fs = require( 'fs' );

/**
 * This function removes the project directory and its contents, remakes the project directory, downloads the zipped
 * sims and sim metadata file, and unzips the zipped sims and sim metadata file.
 */
const getAssets = async () => {

  const assetsUrl = 'https://phet.colorado.edu/archives/all_installer.zip';
  const projectDir = `${__dirname}/../../project`;

  // remove the project directory
  if ( fs.existsSync( projectDir ) ) {

    console.log( 'removing project directory and its contents' );

    // TODO: https://github.com/phetsims/weddell/issues/92
    // using the recursive option here is deprecated
    // we should be using fs.rm, but for some reason it isn't working
    // fs.rm should work on node > 14.14.0, but it's not working on 17.2.0
    // ¯\_(ツ)_/¯
    fs.rmdirSync( projectDir, { recursive: true } );
  }

  // remake the project directory
  if ( !fs.existsSync( projectDir ) ) {
    console.log( 'remaking project directory' );
    fs.mkdirSync( projectDir );
  }

  // get and unzip the zipped sims and sim metadata file
  if ( fs.existsSync( projectDir ) ) {
    console.log( `attempting to download and unzip zipped sims and sim metadata file from ${assetsUrl}` );
    await download( assetsUrl, projectDir, { extract: true } );
  }
  console.log( 'finished downloading and unzipping zipped sims and sim metadata file' );
};

module.exports = getAssets;