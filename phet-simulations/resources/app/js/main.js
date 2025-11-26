// Copyright 2020, University of Colorado Boulder
/**
 * Main entry point for the app.
 *
 * @author Denzell Barnett (PhET Simulations Interactive)
 */

// modules
const adapt = require( './utils/adapt.js' ); // eslint-disable-line require-statement-match
const buildMenuTemplate = require( './utils/buildMenuTemplate.js' ); // eslint-disable-line require-statement-match
const { app, BrowserWindow, Menu } = require( 'electron' ); // eslint-disable-line require-statement-match
const path = require( 'path' );
const child_process = require( 'child_process' );
const console = require( 'console' );
const { dialog } = require( 'electron' ); // eslint-disable-line require-statement-match
const os = require( 'os' );
const jsonfile = require( 'jsonfile' );
const fs = require( 'fs' );
const WeddellConstants = require( './WeddellConstants' );
const which = require( 'which' );
const userSettings = require( 'electron-settings' ); // eslint-disable-line require-statement-match
const unhandled = require( 'electron-unhandled' ); // eslint-disable-line require-statement-match

// constants
const WINDOW_WIDTH_SCALE = 0.84;
const WINDOW_HEIGHT_SCALE = 0.86;
const DEFAULT_WINDOW_WIDTH = 1214;
const DEFAULT_WINDOW_HEIGHT = 793;
const CONFIG_FILE_NAME = 'weddellConfig.json';
const USER_SETTINGS_FILE_NAME = 'phet-app-settings.json';

// Captures unhandled exceptions in main process.
unhandled( {
  logger: () => { console.error(); },
  showDialog: true
} );

// Initialize configuration of global settings.
userSettings.configure( {
  fileName: USER_SETTINGS_FILE_NAME,
  numSpaces: 3,
  prettify: true
} );

// Define a locale parameters from built config file.
const config = jsonfile.readFileSync( path.join( __dirname, `../${CONFIG_FILE_NAME}` ) );
const supportFlash = config.includeFlash || config.includeLegacyFlash;
const builtLocaleAbbreviations = config.localeAbbreviations;
const localeNames = config.localeNames;

let builtDefaultLocaleAbbreviation = !userSettings.getSync( 'userSettings.hasRun' ) ?
                                     config.defaultLocaleAbbreviation :
                                     userSettings.getSync( 'userSettings.localeInfo.defaultLocaleAbbreviation' );


// TODO: Find the locale of the name of the default locale. Consider using a map. May increase performance for all-locale builds.
let localeName = null;
builtLocaleAbbreviations.forEach( builtLocale => {
  if ( builtLocale === builtDefaultLocaleAbbreviation ) {
    localeName = localeNames[ builtLocaleAbbreviations.indexOf( builtLocale ) ];
  }
} );

// Assign keys for locale info and java runs.
// TODO: Consider a field for displayed locales.
userSettings.setSync( 'userSettings', {
  localeInfo: {
    defaultLocaleName: localeName,
    defaultLocaleAbbreviation: builtDefaultLocaleAbbreviation
  },
  javaRuns: 0,
  htmlRuns: 0,
  flashRuns: 0,
  hasRun: true
} );

const defaultLocaleAbbreviation = userSettings.getSync( 'userSettings.localeInfo.defaultLocaleAbbreviation' );

let flashPluginRoot;
let flashPlugin;
let htmlPageRoot;
if ( app.isPackaged ) {

  flashPluginRoot = '../resources';
  htmlPageRoot = './resources';
}
else {
  flashPluginRoot = '../assets';
  htmlPageRoot = './assets';
}

// Use system's installed flash player
try {
  // TODO: Should test for linux platforms
  flashPlugin = os.platform() === 'darwin' ?
                path.join( __dirname, `${flashPluginRoot}/flashPlugin/PepperFlashPlayer/PepperFlashPlayer.plugin` ) :
                path.join( __dirname, `${flashPluginRoot}/flashPlugin/pepflashplayer64_32_0_0_403.dll` );
}
catch( err ) {
  console.log( `Could not locate plugin for flash, err = ${err}` );
}
if ( flashPlugin ) {
  app.commandLine.appendSwitch( 'ppapi-flash-path', flashPlugin );
}

// If this build is configured to not include flash then override any flash support
flashPlugin = flashPlugin && supportFlash;

// Keep track of whether the JDK is installed and its location
const javaLocation = which.sync( 'java', { nothrow: true } );

// If the java location can be found then store its location
const javaInstalled = fs.existsSync( javaLocation );

// Options for windows
const windowOptions = {
  width: DEFAULT_WINDOW_WIDTH,
  height: DEFAULT_WINDOW_HEIGHT,
  darkTheme: true,
  backgroundColor: '#f7f7f7',
  webPreferences: {
    plugins: true
  },
  webviewTag: true,
  minWidth: 720
};

/**
 * Create the window responsible for the homepage.
 */
function createHomeWindow() {

  // Create the homepage window.
  this.mainWindow = new BrowserWindow( windowOptions );
  this.mainWindow.center();

  // Load the html for the homepage
  this.mainWindow.loadFile( `${htmlPageRoot}/html/homepage_${defaultLocaleAbbreviation}.html` );

  // TODO: Temporary placeholder that triggers fallbacks for flash and java sims.
  const linuxBypass = process.platform === 'linux';

  // Adapt html elements based on system properties
  if ( !flashPlugin || linuxBypass ) {
    adapt( this.mainWindow, WeddellConstants.ADAPTER_FEATURE_ENUM.Flash, supportFlash );
  }
  if ( !javaInstalled || linuxBypass ) {
    adapt( this.mainWindow, WeddellConstants.ADAPTER_FEATURE_ENUM.Java, supportFlash );
  }
  if ( process.platform !== 'win32' || linuxBypass ) {
    adapt( this.mainWindow, WeddellConstants.ADAPTER_FEATURE_ENUM.MacOS, supportFlash );
  }

  // Error handling for loading the html
  this.mainWindow.webContents.on( 'did-fail-load', event => {
    dialog.showErrorBox( 'Error', event );
  } );

  let windowWidth;
  let windowHeight;

  // Triggered when the sims tiles are clicked by the user and the homepage forces a navigation to another window.
  this.mainWindow.webContents.on( 'will-navigate', ( event, url ) => {
      event.preventDefault();

      // Adjust height and width options for each
      windowWidth = Math.round( this.mainWindow.getSize()[ 0 ] * WINDOW_WIDTH_SCALE );
      windowHeight = Math.round( this.mainWindow.getSize()[ 1 ] * WINDOW_HEIGHT_SCALE );

      // Handle launching HTML5 sims
      if ( url.includes( '_all.html' ) ) {
        launchSim( false, url, windowOptions, windowWidth, windowHeight, false );
      }

      // Handle launching flash sims if we detect a plugin
      if ( !url.includes( 'html/' ) && url.includes( '.html' ) && flashPlugin ) {
        launchSim( false, url, windowOptions, windowWidth, windowHeight, false );
      }

      // Handle launching legacy flash sims that have HTML5 conversions
      if ( url.includes( 'flash/' ) && url.includes( '_en.jar' ) && flashPlugin ) {
        launchSim( false, url, windowOptions, windowWidth, windowHeight, true );
      }

      // Handle launching Java sims
      if ( url.includes( 'all.jar' ) && javaInstalled ) {
        launchSim( true, url, windowOptions, null, null, false );
      }
    }
  );

  // Add event that will open our main page.
  app.on( 'show-main-window-event', main => {
    main.window.show();
    app.dock.show();
  } );
}

/**
 * Load locale specific homepage and set the default locale
 * @param {string} newLocale
 * @param {BrowserWindow} window
 * @private
 */
const adjustLocale = ( newLocale, window ) => {
  builtDefaultLocaleAbbreviation = newLocale;
  window.loadFile( `${htmlPageRoot}/html/homepage_${newLocale}.html` );
};

/**
 * Add locale specific options to the locale drop down menu.
 * @param {Array.<string>} localeNames
 * @param {Array.<string>} builtLocales
 * @private
 */
const addLocalesToTemplate = ( localeNames, builtLocales ) => {
  const menuItems = [];
  localeNames.forEach( localeName => {
    const abbreviation = builtLocales[ localeNames.indexOf( localeName ) ];
    menuItems.push( {
      label: localeName,
      click() {

        // Responsible for refreshing to the selected locale.
        adjustLocale( abbreviation, this.mainWindow );

        // Write to user settings with a new default locale and name
        userSettings.setSync( 'userSettings.localeInfo', {
          defaultLocaleName: localeName,
          defaultLocaleAbbreviation: abbreviation
        } );
      },
      type: 'radio'
    } );
  } );

  // If the user settings determines a default locale then check that locale selection. Otherwise default to checking
  // the first menu item.
  const selectedLocaleIndex = userSettings.getSync( 'userSettings.localeInfo.defaultLocaleName' ) ?
                              localeNames.indexOf( userSettings.getSync( 'userSettings.localeInfo.defaultLocaleName' ) ) : 1;
  // Add two to this index
  menuItems[ selectedLocaleIndex ].checked = true;
  return menuItems;
};

/**
 * HTML5 and Flash sims get launched with a new BrowserWindow using Electron's api. Java sims are launched using a child
 * process that executes the common CLI method of launching jar files (i.e. java sim_all.jar -cp path.to.mainClass)
 *
 * @param {boolean} isJavaSim: Valid values are 'html5', 'flash', and 'java'
 * @param {string} url: Generated path to sim file. These paths are built by a grunt task and isn't guaranteed to match
 *                      the file's location on the file system
 * @param {object} windowOptions
 * @param {number|null} windowWidth
 * @param {number|null} windowHeight
 * @param {boolean} flashLegacy
 *
 */
const launchSim = ( isJavaSim, url, windowOptions, windowWidth, windowHeight, flashLegacy ) => {

  // Launch a sim window from Electron's api
  if ( !isJavaSim ) {

    // Update window options
    windowOptions.width = windowWidth;
    windowOptions.height = windowHeight;

    const simWindow = new BrowserWindow( windowOptions );
    simWindow.removeMenu();
    simWindow.center();
    if ( flashLegacy ) {
      simWindow.loadFile( url.replace( '_en.jar', '_en.html' ) );
    }
    else {
      simWindow.loadURL( url );
    }
  }

  // Launch a sim window using the all.jar file
  else {

    // Build args to execute java command. These arguments depend on the url of the sim tile that was clicked
    const cmdArgs = url.split( '/' );

    // If a locale isn't specified fall back to english
    const language = builtDefaultLocaleAbbreviation.split( '_' )[ 0 ] === undefined ?
                     builtDefaultLocaleAbbreviation : builtDefaultLocaleAbbreviation.split( '_' )[ 0 ];
    const country = builtDefaultLocaleAbbreviation.split( '_' )[ 1 ] === undefined ?
                    '' : builtDefaultLocaleAbbreviation.split( '_' )[ 1 ];

    // These arguments are platform dependent because windows paths don't exactly math osx paths
    const project = os.platform() === 'darwin' ? cmdArgs[ 3 ] : cmdArgs[ 4 ];
    const projectWithoutHyphen = os.platform() === 'darwin' ? cmdArgs[ 4 ] : cmdArgs[ 5 ];
    const applicationName = os.platform() === 'darwin' ? cmdArgs[ 5 ] : cmdArgs[ 6 ];

    // Perform command execution at project directory
    const directory = path.join( __dirname, `./../resources/simulations/java/${project}` );
    child_process.spawn(
      `${javaLocation}`, [
        `-Djavaws.user.language=${language}`,
        `-Djavaws.user.country=${country}`,
        '-cp',
        `${project}_all.jar`,
        `edu.colorado.phet.${projectWithoutHyphen}.${applicationName}`
      ], {
        cwd: directory
      } );
  }
};

// Build menu template
const menuTemplate = buildMenuTemplate( addLocalesToTemplate( localeNames, builtLocaleAbbreviations ) );
const appMenu = Menu.buildFromTemplate( menuTemplate );
Menu.setApplicationMenu( appMenu );

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then( createHomeWindow );

// Quit when all windows are closed.
app.on( 'window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if ( process.platform !== 'darwin' ) {
    app.quit();
  }
} );

app.on( 'activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if ( BrowserWindow.getAllWindows().length === 0 ) {
    createHomeWindow();
  }
} );

// app.on( 'open-url', ( event, url ) => {
//   event.preventDefault();
//   console.log( 'Break12' );
// } );
// console.log( protocol.registerStandardSchemes );
// protocol.registerStandardSchemes( [ 'electron' ] );
// app.on( 'ready', () => {
//   protocol.registerHttpProtocol( 'electron' )
// } );