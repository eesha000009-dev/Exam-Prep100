// Copyright 2020, University of Colorado Boulder
/**
 * Helper function used to configure the app to under various conditions. For example stripping away windows only sims
 * on MacOS platforms.
 *
 * @author Denzell Barnett (PhET Simulations Interactive)
 */
const { dialog } = require( 'electron' ); // eslint-disable-line require-statement-match
const WeddellConstants = require( './../WeddellConstants' );

module.exports = ( mainWindow, adapterFeature, includeFlash ) => {

  // Error handling when Flash plugin isn't found on OS
  if ( adapterFeature === WeddellConstants.ADAPTER_FEATURE_ENUM.Flash ) {

    if ( includeFlash ) {
      // Prompt a message to the user when Flash isn't installed properly
      dialog.showMessageBox( mainWindow, {
        message: 'Flash not installed locally on this device. To use Flash sims, download the latest version of Flash.'
      } );
    }

    // This will be executed when the main window is loaded. Responsible for disabling the flash sims.
    const disableFlashSims =
      `
      document.getElementById('flash-plugin-failure-message').style.display = '';
      document.getElementById('sim-collection-flash').className='disabled';
      document.getElementById('translated-sim-collection-all').classList.add( 'flash-disabled' );
      
      const untranslatedFlashSims = document.getElementById('untranslated-sim-collection-flash');
      untranslatedFlashSims && untranslatedFlashSims.classList.remove( 'untranslated' );
      `;

    mainWindow.webContents.on( 'did-finish-load', () => {
      mainWindow.webContents.executeJavaScript( disableFlashSims );
    } );
  }

  // Error handling when Java plugin isn't found on OS
  else if ( adapterFeature === WeddellConstants.ADAPTER_FEATURE_ENUM.Java ) {

    // Prompt a message to the user when Java isn't installed properly
    dialog.showMessageBox( mainWindow, {
      message: 'Java not installed locally on this device. To use Java sims, download the latest version of Java.'
    } );

    // This will be executed when the main window is loaded. Responsible for disabling the Java sims.
    const disableJavaSims =
      `
      document.getElementById('java-plugin-failure-message').style.display = '';
      document.getElementById('sim-collection-java').className = 'disabled';
      document.getElementById('translated-sim-collection-all').classList.add( 'java-disabled' );
      
      const untranslatedJavaSims = document.getElementById('untranslated-sim-collection-java');
      untranslatedJavaSims && untranslatedJavaSims.classList.remove( 'untranslated' );
      `;

    mainWindow.webContents.on( 'did-finish-load', () => {
      mainWindow.webContents.executeJavaScript( disableJavaSims );
    } );
  }
  else if ( adapterFeature === WeddellConstants.ADAPTER_FEATURE_ENUM.MacOS ) {
    const disableWindowsOnlyFeatures =
      `
        const windowsOnlyElements = document.getElementsByClassName("windowsOnly");

        while (windowsOnlyElements.length > 0){
         windowsOnlyElements[0].remove();
        }
      `;
    mainWindow.webContents.on( 'did-finish-load', () => {
      mainWindow.webContents.executeJavaScript( disableWindowsOnlyFeatures );
    } );
  }
};