// Copyright 2020, University of Colorado Boulder

/**
 * Runs the lint rules on the specified files. This was derived from chipper/js/grunt/lint.js
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */


// modules
const eslint = require( 'eslint' );
const grunt = require( 'grunt' );
const path = require( 'path' );
const child_process = require( 'child_process' );

/**
 * Lints the specified repositories.
 * @public
 *
 * @param {boolean} say - whether errors should be read out loud
 * @param {boolean} warn - whether errors should reported with grunt.warn
 * @returns {Object} - ESLint report object.
 */
module.exports = function( say = false, warn = true ) {

  const cli = new eslint.CLIEngine( {

    fix: false, // make this true if you want to fix lint rules, make sure to uncomment the fix output below

    cwd: path.dirname( process.cwd() ),

    // Our custom rules live here
    rulePaths: [ 'chipper/eslint/rules' ],

    resolvePluginsRelativeTo: 'chipper/'
  } );

  // run the eslint step
  const report = cli.executeOnFiles( [ 'weddell' ] );

  // pretty print results to console if any
  ( report.warningCount || report.errorCount ) && grunt.log.write( cli.getFormatter()( report.results ) );

  say && report.warningCount && child_process.execSync( 'say Lint warnings detected!' );
  say && report.errorCount && child_process.execSync( 'say Lint errors detected!' );

  if ( warn ) {
    report.warningCount && grunt.fail.warn( `${report.warningCount} Lint Warnings` );
    report.errorCount && grunt.fail.fatal( `${report.errorCount} Lint Errors` );
  }

  return report;
};
