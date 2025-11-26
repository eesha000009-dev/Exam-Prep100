// Copyright 2020, University of Colorado Boulder
/**
 * Creates a directory that will be packaged in the build artifact. This directory will be treated as the home directory
 * of the app during its runtime.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

// modules
const copyDirectory = require( './../../../chipper/js/grunt/copyDirectory.js' ); // eslint-disable-line
const fs = require( 'fs' );
const jsonfile = require( 'jsonfile' );
const path = require( 'path' );
const child_process = require( 'child_process' );
const WeddellConstants = require( './../WeddellConstants.js' ); // eslint-disable-line

// constants
const CONFIG_DIRECTORY = WeddellConstants.CONFIG_DIRECTORY;
const TEMP_DIR = WeddellConstants.TEMP_DIR;
const FLASH_SIM_EXCLUDE = WeddellConstants.FLASH_SIM_EXCLUDE;
const PROJECT_DIRECTORY = WeddellConstants.PROJECT_DIRECTORY;
const RESOURCE_DIRECTORY = WeddellConstants.RESOURCE_DIRECTORY;
const ASSETS_DIRECTORY = WeddellConstants.ASSETS_DIRECTORY;

module.exports = () => {
  const config = jsonfile.readFileSync( path.join( __dirname, `./../../${CONFIG_DIRECTORY}` ) );

  /**
   * Helper function to delete a file
   * @param file
   */
  const deleteFileSync = file => child_process.execSync( `rm -r ${file}`, {
    cwd: './',
    stdio: 'inherit'
  } );

  /**
   * Helper function to move HTML5, Flash, and Java sims into their respective directories.
   * @param includeFlash {boolean}
   */
  const buildTempSimDirectory = includeFlash => {

    // Make sure we build a clean temp directory. Typically necessary if build process was interrupted.
    if ( fs.existsSync( TEMP_DIR ) ) {
      console.log( 'Cleaning temp directory...' );
      deleteFileSync( TEMP_DIR );
    }
    console.log( 'Building temp directory...' );

    // Includes any flash sims
    if ( includeFlash ) {

      // Build flash directory
      console.log( 'Copying Flash directory...' );
      FLASH_SIM_EXCLUDE.forEach( flashSimDirectory => {
        copyDirectory( `${PROJECT_DIRECTORY}/${flashSimDirectory}`, `${TEMP_DIR}/simulations/flash/${flashSimDirectory}`, null );
      } );

      // Add flash sims even if they have html5 conversions. All legacy flash sims will be included
      if ( config.includeLegacyFlash ) {
        console.log( 'Copying additional legacy Flash content...' );
        const legacyFlashSims = fs.readdirSync( './legacyFlashSims/flash' );
        legacyFlashSims.forEach( legacyFlashSim => {
          const simName = legacyFlashSim.replace( '_en.jar', '' );

          // Don't duplicate any of the previously included flash sims.
          if ( !FLASH_SIM_EXCLUDE.includes( simName ) ) {
            fs.copyFileSync( `./legacyFlashSims/flash/${legacyFlashSim}`, `${TEMP_DIR}/simulations/flash/${legacyFlashSim}`, null );
          }
        } );
      }
    }

    // Conditionally add any assets pertaining to flash content
    copyDirectory( ASSETS_DIRECTORY, TEMP_DIR, null, {
      exclude: includeFlash ? [] : [ 'flashPlugin', 'license' ]
    } );

    // Build java directory
    console.log( 'Copying Java directory...' );
    copyDirectory( PROJECT_DIRECTORY, `${TEMP_DIR}/simulations/java`, null, {
      exclude: FLASH_SIM_EXCLUDE.concat( 'html' )
    } );

    // Build html directory
    console.log( 'Copying HTML directory...' );
    copyDirectory( `${PROJECT_DIRECTORY}/html`, `${TEMP_DIR}/simulations/html`, null );
  };

  // Build temporary directory
  buildTempSimDirectory( config.includeFlash || config.includeLegacyFlash );

  // Transfer over all transfer content in temp directory into the original
  copyDirectory( TEMP_DIR, RESOURCE_DIRECTORY, null );

  // Delete temp directory
  console.log( 'Deleting temp directory...\n' );
  deleteFileSync( TEMP_DIR );
};