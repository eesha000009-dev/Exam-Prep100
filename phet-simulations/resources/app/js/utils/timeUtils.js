// Copyright 2020, University of Colorado Boulder
/**
 * Responsible for building any time sensitive information during the build process.
 *
 * @author Denzell Barnett (PhET Simulations Interactive)
 */

module.exports = {
  getDirectoryDateName: () => {
    const date = new Date( Date.now() );
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  },

  getTimeStamp: () => {
    return Date.now();
  }
};