// Copyright 2022, University of Colorado Boulder

/**
 * Export a function that deploys the PhET desktop app.
 *
 * @author Liam Mulhall
 */

const WeddellConstants = require( '../WeddellConstants.js' ); // eslint-disable-line
const child_process = require( 'child_process' );
const getSourceFilesToDeploy = require( './getSourceFilesToDeploy.js' ); // eslint-disable-line

// constants
const CHILD_PROCESS_OPTIONS = { stdio: 'inherit' };

/**
 * Deploys the PhET desktop app to development or production depending on its parameters. This function is called in
 * the 'development-deploy' Grunt task and the 'production-deploy' Grunt task.
 *
 * N.B. This assumes the computer this function is running on has its public SSH key in phet-admin's
 * ~/.ssh/authorized_keys file.
 *
 * When deploying to development, keep in mind that the destination is where an ISO date (YYYY-MM-DD) directory will be
 * created, and the app files will be deployed to the ISO date directory.
 *
 * @param {String} deployType - what kind of deploy we're doing; valid options are development and production
 * @param {String} destination - where we're deploying the files
 * @param {String} platform - which platform we're deploying; valid options are all, mac, or windows
 */
const deploy = ( deployType, destination, platform ) => {

  // make sure the caller supplies parameters
  if ( !deployType ) {
    throw new Error( 'you must provide a deploy type of either development or production' );
  }
  if ( !destination ) {
    throw new Error( 'you must provide a destination for your source files' );
  }
  if ( !platform ) {
    throw new Error( 'you must provide a platform of all, mac, or windows' );
  }

  // get the source files to deploy
  const sourceFilesToDeploy = getSourceFilesToDeploy( platform );

  // if the caller wants to deploy to development...
  if ( deployType === 'development' ) {

    // we need make an iso date (yyyy-mm-dd) directory at the destination
    const todayIsoDate = new Date().toISOString().slice( 0, 10 );
    const makeTodayIsoDateDirectory = `ssh ${WeddellConstants.DEVELOPMENT_DEPLOY_SERVER} "cd ${WeddellConstants.DEVELOPMENT_DEPLOY_PATH}; mkdir -p ${todayIsoDate}"`;
    try {
      child_process.execSync( makeTodayIsoDateDirectory, CHILD_PROCESS_OPTIONS );
    }
    catch( e ) {
      console.error( `unable to make iso date directory at ${destination}; aborting deploy` );
      console.error( e );
      return;
    }

    // deploy the source files to the new iso date directory
    const destinationWithIsoDateDirectory = `${destination}/${todayIsoDate}`;
    for ( const source of sourceFilesToDeploy ) {
      const developmentDeployCommand = `scp ${source} ${destinationWithIsoDateDirectory}`;
      try {
        child_process.execSync( developmentDeployCommand, CHILD_PROCESS_OPTIONS );
      }
      catch( e ) {
        console.error( `unable to deploy ${source} to ${destinationWithIsoDateDirectory}; aborting deploy` );
        console.error( e );
        return;
      }
    }
  }

  // if the caller wants to deploy to production...
  else if ( deployType === 'production' ) {

    // deploy the source files
    for ( const source of sourceFilesToDeploy ) {
      const productionDeployCommand = `scp ${source} ${destination}`;
      try {
        child_process.execSync( productionDeployCommand, CHILD_PROCESS_OPTIONS );
      }
      catch( e ) {
        console.error( `unable to deploy ${source} to ${destination}; aborting deploy` );
        console.error( e );
        return;
      }
    }
  }

  // if the user messed up their deploy type parameter...
  else {
    throw new Error( 'you must provide a deploy type of either development or production' );
  }
};

module.exports = deploy;