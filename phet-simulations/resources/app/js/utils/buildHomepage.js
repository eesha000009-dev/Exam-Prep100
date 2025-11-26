// Copyright 2020, University of Colorado Boulder
const grunt = require( 'grunt' );
const metadata = require( './../../metadata' );
const _ = require( 'lodash' ); // eslint-disable-line
const jsonfile = require( 'jsonfile' );
const WeddellConstants = require( './../WeddellConstants' );
const fs = require( 'fs' );

// constants
const ALL_LOCALES_PATH = './../chipper/data/localeInfo.json';

module.exports = options => {

  const buildLocales = options.locales;
  const includeLegacyFlash = options.includeLegacyFlash;
  const includeFlash = options.includeFlash || includeLegacyFlash;

  let allLocales = null;
  try {
    allLocales = jsonfile.readFileSync( ALL_LOCALES_PATH );
  }
  catch( err ) {
    grunt.log.warn( 'All locales path not found.' );
  }
  const localeNames = [];

  let targetLocales;
  let defaultLocale;

  // If no locales are passed into the build command, then build all locales.
  if ( buildLocales ) {
    targetLocales = buildLocales.split( ',' );
    defaultLocale = targetLocales[ 0 ];
    grunt.log.writeln( `Building for locales: ${buildLocales}\nDefault locale will be: ${defaultLocale}` );
  }
  else {
    targetLocales = Object.keys( allLocales );
    defaultLocale = 'en';
    grunt.log.writeln( 'Building for all supported locales.\nDefault locale will be: en' );
  }

  targetLocales.forEach( buildLocale => {
    grunt.log.writeln( `\nBuilding locale: ${buildLocale}\n` );
    localeNames.push( allLocales[ buildLocale ].name );

    // Html file we are building.
    const homepageTemplatePath = './html/homepageTemplate.html';

    // We are keeping track of converted sims, so we don't display their legacy versions.
    const convertedSims = [];

    // Codebase specific elements that are built below
    let allObjects = [];
    let htmlElement;
    let flashElement;
    let javaElement;

    // Public facing title of the sim.
    let title;

    // Naming convention of sim project. Used for java hrefs.
    let projectName;


    // URL for the specific sim we are targeting.
    let localSimUrl;
    let localImageUrl;

    // Read out the metadata.json
    // TODO: Remove dead code when safe to do so. See https://github.com/phetsims/weddell/issues/73.
    // console.dir( grunt.file.readJSONSync( './../../simulations/metadata.json' ), { 'maxArrayLength': null } );

    // Iterate through the metadata for the localized simulation.
    for ( let projectIndex = 0; projectIndex < metadata.projects.length; projectIndex++ ) {
      const project = metadata.projects[ projectIndex ];
      for ( let simulationIndex = 0; simulationIndex < project.simulations.length; simulationIndex++ ) {
        const simulation = project.simulations[ simulationIndex ];
        let localizedSimulation = simulation.localizedSimulations.find( ls => ls.locale === buildLocale );
        let simulationIsTranslated = true;
        if ( !localizedSimulation ) {
          simulationIsTranslated = false;
          localizedSimulation = simulation.localizedSimulations.find( ls => ls.locale === 'en' );
        }

        // Update the title
        title = localizedSimulation.title;

        // Target all the html sims and build its html element
        if ( project.type === 'html' ) {
          localSimUrl = JSON.stringify( `../../resources/simulations/html/${simulation.name}/${simulation.name}_all.html?locale=${localizedSimulation.locale}` );
          localImageUrl = JSON.stringify( `../../resources/simulations/html/${simulation.name}/${simulation.name}-600.png` );
          htmlElement = `
            <li>
              <a class="tile grid" href=${localSimUrl}>
                <div class="image-holder"><img
                    class="thumbnail" width="210" height="140"
                    src=${localImageUrl}></div>
                <div class="information">
                  <div class="title-holder"><span class="title">${title}</span></div>
                  <div class="icons">
                    ${WeddellConstants.HTML_BADGE}
                  </div>
                </div>
              </a>
            </li>`;

          // Track the html element and the converted sim
          allObjects.push( {
            name: simulation.name,
            type: project.type,
            element: htmlElement,
            simulationIsTranslated: simulationIsTranslated
          } );
          convertedSims.push( simulation.name );
        }
      }
    }

    // Iterate through the metadata after we have tracked the converted sims.
    for ( let projectIndex = 0; projectIndex < metadata.projects.length; projectIndex++ ) {
      const project = metadata.projects[ projectIndex ];
      for ( let simulationIndex = 0; simulationIndex < project.simulations.length; simulationIndex++ ) {
        const simulation = project.simulations[ simulationIndex ];
        let localizedSimulation = simulation.localizedSimulations.find( ls => ls.locale === buildLocale );
        let simulationIsTranslated = true;
        if ( !localizedSimulation ) {
          simulationIsTranslated = false;
          localizedSimulation = simulation.localizedSimulations.find( ls => ls.locale === 'en' );
        }
        // Update the title
        title = localizedSimulation.title;

        // Build an element for flash sims that don't have html conversions.
        if ( includeFlash && project.type === 'flash' && !convertedSims.includes( simulation.name ) ) {
          localSimUrl = JSON.stringify( `../../resources/simulations/flash/${simulation.name}/${simulation.name}_${localizedSimulation.locale}.html` );
          localImageUrl = JSON.stringify( `../../resources/simulations/flash/${simulation.name}/${simulation.name}-600.png` );

          // Special cases for certain sims
          if ( simulation.name === 'buoyancy' ) {
            grunt.log.warn( `${simulation.name} project doesn't exist in file system.` );
            localSimUrl = JSON.stringify( `../../resources/simulations/flash/density-and-buoyancy/${simulation.name}_${buildLocale}.html` );
            localImageUrl = JSON.stringify( `../../resources/simulations/flash/density-and-buoyancy/${simulation.name}-600.png` );
          }
          if ( simulation.name === 'density' ) {
            grunt.log.warn( `${simulation.name} project doesn't exist in file system.` );
            localSimUrl = JSON.stringify( `../../resources/simulations/flash/density-and-buoyancy/${simulation.name}_${buildLocale}.html` );
            localImageUrl = JSON.stringify( `../../resources/simulations/flash/density-and-buoyancy/${simulation.name}-600.png` );
          }
          else if ( simulation.name === 'mass-spring-lab' ) {
            grunt.log.warn( `${simulation.name} project doesn't exist in file system.` );
            continue;
          }
          else if ( simulation.name === 'equation-grapher' ) {
            grunt.log.warn( `${simulation.name} project doesn't exist in file system.` );
            continue;
          }

          flashElement = `
            <li>
              <a class="tile flash grid" href=${localSimUrl}>
                <div class="image-holder"><img
                    class="thumbnail" width="210" height="140"
                    src=${localImageUrl}></div>
                <div class="information">
                  <div class="title-holder"><span class="title">${title}</span></div>
                  <div class="icons">
                    ${WeddellConstants.FLASH_BADGE}
                  </div>
                </div>
              </a>
            </li>`;

          // Track the flash element
          allObjects.push( {
            name: simulation.name,
            type: project.type,
            element: flashElement,
            simulationIsTranslated: simulationIsTranslated
          } );

        }
        else if ( project.type === 'java' && !convertedSims.includes( simulation.name ) ) {
          const strippedName = simulation.name.replace( ' ', '' );

          // Manipulate the simulation name to fit the java main class application naming convention.
          let applicationName = `${_.startCase( _.toLower( simulation.name.replace( /-/g, ' ' ) ) )}Application`;
          let imageName;
          let tileError;
          let windowsOnly = '';
          localSimUrl = JSON.stringify( `/${simulation.name}/${strippedName}/${applicationName}/all.jar` );
          localImageUrl = JSON.stringify( `../../resources/simulations/java/${simulation.name}/${simulation.name}-600.png` );

          grunt.file.recurse( './project', ( abspath, rootdir, subdir, filename ) => {
            if ( filename.indexOf( '.png' ) !== -1 && filename.indexOf( strippedName ) !== -1 ) {
              imageName = filename;
              projectName = subdir;

              // TODO: Use a map and refactor this if/else block. This was implemented for testing purposes and has served its purpose. See https://github.com/phetsims/weddell/issues/75.
              // Special cases for certain sims that aren't handled by above name manipulation
              if ( simulation.name === 'stretching-dna' ) {
                grunt.log.warn( `${simulation.name} requires custom naming.` );
                applicationName = 'StretchingDNAApplication';
              }
              else if ( simulation.name === 'balloons' && subdir === 'html/balloons-and-static-electricity' ) {
                grunt.log.warn( `${simulation.name} project doesn't exist in file system.` );
                tileError = true;
              }

              else if ( simulation.name === 'travoltage' ) {
                grunt.log.warn( `${simulation.name} is already converted.` );
                tileError = true;
              }
              else if ( applicationName === ' EnergySkate ParkApplication' && subdir.indexOf( 'html' ) !== 1 ) {
                grunt.log.warn( 'Energy Skate Park does not exist.' );
                tileError = true;
              }
            }
          } );

          // TODO: Use a map and refactor this if/else block. This was implemented for testing purposes and has served its purpose. See https://github.com/phetsims/weddell/issues/75.
          let strippedProjectName = projectName.replace( /[^a-zA-Z0-9]/g, '' );
          let strippedApplicationName = applicationName.replace( /[^a-zA-Z0-9]/g, '' );
          if ( simulation.name === 'balloons' ) {
            strippedApplicationName = 'BalloonsApplication';
            grunt.log.warn( `${simulation.name} Uses corrected application name.` );
            tileError = true;
          }
          else if ( simulation.name === 'rotation' ) {
            strippedApplicationName = 'LadybugRevolutionApplication';
            grunt.log.warn( `${simulation.name} Uses corrected application name.` );
          }
          else if ( simulation.name === 'gene-expression-basics' ) {
            grunt.log.warn( `${title} Uses corrected application name.` );
            tileError = true;
          }
          else if ( simulation.name === 'plate-tectonics' ) {
            grunt.log.warn( '\n\nPlate-tectonics is not supported on mac.\n\n' );
            windowsOnly = 'windowsOnly';
          }
          else if ( simulation.name === 'fourier' ) {
            grunt.log.warn( '\n\nGeneExpression - The BasicsApplication does not exist.\n\n' );
            tileError = true;
          }
          else if ( simulation.name === 'forces-and-motion' ) {
            strippedProjectName = 'motionseries.sims.forcesandmotion';
            strippedApplicationName = 'ForcesAndMotionApplication';
            grunt.log.warn( `${simulation.name} Uses corrected application name.` );
          }
          else if ( simulation.name === 'ramp-forces-and-motion' ) {
            strippedProjectName = 'motionseries.sims.rampforcesandmotion';
            strippedApplicationName = 'RampForcesAndMotionApplication';
            grunt.log.warn( `${simulation.name} Uses corrected application name.` );
          }
          else if ( simulation.name === 'efield' ) {
            strippedProjectName = 'efield';
            strippedApplicationName = 'EFieldApplication';
            grunt.log.warn( `${simulation.name} Uses corrected application name.` );
          }
          else if ( simulation.name === 'circuit-construction-kit-ac' ) {
            strippedProjectName = 'circuitconstructionkit';
            strippedApplicationName = 'CircuitConstructionKitACApplication';
            grunt.log.warn( `${simulation.name} Uses corrected application name.` );
          }
          else if ( simulation.name === 'circuit-construction-kit-ac-virtual-lab' ) {
            strippedProjectName = 'circuitconstructionkit';
            strippedApplicationName = 'CircuitConstructionKitACVirtualLabApplication';
            grunt.log.warn( `${simulation.name} project is already converted.` );
          }
          else if ( strippedApplicationName === 'CapacitorLabApplication' ) {
            strippedProjectName = 'capacitorlab';
            strippedApplicationName = 'CapacitorLabApplication';
            projectName = 'capacitor-lab';
            imageName = 'capacitor-lab-600.png';
            grunt.log.warn( `${simulation.name} Uses corrected application name.` );
          }
          else if ( simulation.name === 'energy-skate-park' ) {
            strippedProjectName = 'energyskatepark';
            strippedApplicationName = 'EnergySkateParkApplication';
            projectName = 'energy-skate-park';
            imageName = 'energy-skate-park-600.png';
            grunt.log.warn( `${simulation.name} Uses corrected application name.` );
          }
          else if ( simulation.name === 'gene-machine-lac-operon' ) {
            projectName = 'gene-network';
            strippedProjectName = 'genenetwork';
            strippedApplicationName = 'LacOperonApplication';
            imageName = 'gene-machine-lac-operon-600.png';
            grunt.log.warn( `${simulation.name} Uses corrected application, project, and image name.` );
          }
          else if ( simulation.name === 'faraday' ) {
            strippedProjectName = 'faraday';
            strippedApplicationName = 'FaradayApplication';
            projectName = 'faraday';
            imageName = 'faraday-600.png';
            grunt.log.warn( `${simulation.name} Uses corrected application name.` );
          }
          javaElement = `<li>
            <a class="tile grid java ${windowsOnly}" href="/${projectName}/${strippedProjectName}/${strippedApplicationName}/all.jar">
              <div class="image-holder"><img
                  class="thumbnail" width="210" height="140"
                  src="../../resources/simulations/java/${projectName}/${imageName}">
              </div>
              <div class="information">
                <div class="title-holder"><span class="title">${title}</span></div>
                <div class="icons">
                   ${WeddellConstants.JAVA_BADGE}
                </div>
              </div>
            </a>
          </li>`;

          // If we hit one of our special cases, don't build a tile.
          if ( !tileError ) {

            // Track the java element
            allObjects.push( {
              name: simulation.name,
              type: project.type,
              element: javaElement,
              simulationIsTranslated: simulationIsTranslated
            } );
          }
          else {
            javaElement = '';
          }
        }
      }
    }

    // Keep track of our sim specific elements
    const htmlTranslatedElements = [];
    const flashTranslatedElements = [];
    const javaTranslatedElements = [];
    const allTranslatedElements = [];

    const htmlUntranslatedElements = [];
    const flashUntranslatedElements = [];
    const javaUntranslatedElements = [];
    const allUntranslatedElements = [];

    // Sort all sim tiles for all filter
    allObjects = _.sortBy( allObjects, 'name' );

    // Filter out elements based on code base type.
    const htmlObjects = allObjects.filter( element => {
      return element.type === 'html';
    } );

    const flashObjects = allObjects.filter( element => {
      return element.type === 'flash';
    } );

    const javaObjects = allObjects.filter( element => {
      return element.type === 'java';
    } );

    /**
     * Add elements depending on whether the sim is translated.
     * @param objectGroup
     * @param translatedElements
     * @param untranslatedElements
     */
    const addElements = ( objectGroup, translatedElements, untranslatedElements ) => {
      objectGroup.forEach( item => {
        if ( item.simulationIsTranslated ) {
          translatedElements.push( item.element );
        }
        else {
          untranslatedElements.push( item.element );
        }
      } );
    };

    /**
     *
     * @param untranslatedElements
     * @param type
     * @returns {string}
     */
    const getUntranslatedCollection = ( untranslatedElements, type ) => {

      // Build separator element for untranslated html sims
      if ( untranslatedElements.length ) {
        return ` 
    <hr>
      <h3 class="h3 header" align="center">Simulations not yet translated.</h3>
      <ul id='untranslated-sim-collection-${type}' class='sim-collection grid untranslated'>
        ${untranslatedElements.join( '\n' )}
      </ul>`;
      }
      else {
        return '';
      }
    };

    /**
     *
     * @param {string} legacyFlashSim
     * @param {string} simName
     * @returns {string}
     */
    const buildLegacyFlashContent = ( legacyFlashSim, simName ) => {
      return `
          <li>
              <a class="tile flash list" href="../../resources/simulations/flash/${legacyFlashSim}">
                <div class="information">
                  <div class="title-holder"><span class="title">${simName}</span></div>
                  <div class="icons">
                      ${WeddellConstants.FLASH_BADGE}
                  </div>
                </div>
              </a>
          </li>`;
    };

    addElements( htmlObjects, htmlTranslatedElements, htmlUntranslatedElements );
    addElements( flashObjects, flashTranslatedElements, flashUntranslatedElements );
    addElements( javaObjects, javaTranslatedElements, javaUntranslatedElements );
    addElements( allObjects, allTranslatedElements, allUntranslatedElements );

    let legacyFlashListItems = '';
    let legacyFlashSims = null;

    // Build html content for legacy flash sims,
    if ( includeLegacyFlash ) {
      try {
        legacyFlashSims = fs.readdirSync( './legacyFlashSims/flash' );
      }
      catch( err ) {
        console.log( `Unable to get legacy flash sims: ${err}` );
        console.log( err.stack );
        process.exit( 1 );
      }
      legacyFlashSims.forEach( legacyFlashSim => {
        const simName = legacyFlashSim.replace( '_en.html', '' );
        if ( !WeddellConstants.FLASH_SIM_EXCLUDE.includes( simName ) && legacyFlashSim !== '.DS_store' &&
             !legacyFlashSim.includes( '.swf' ) && !legacyFlashSim.includes( '.jar' ) ) {
          legacyFlashListItems = legacyFlashListItems + buildLegacyFlashContent( legacyFlashSim, simName );
        }
      } );
    }

    const legacyFlashContent = `
      <hr>
      <h3 class="h3 header" align="center">Legacy Flash Sims</h3>
      <ul id="translated-sim-collection-flash" class="sim-collection list">
      ${legacyFlashListItems}
      </ul>`;

    // Duplicated from Chipper
    const replacePlaceholders = ( str, mapping ) => {
      Object.keys( mapping ).forEach( key => {
        const replacement = mapping[ key ];
        key = `{{${key}}}`;
        let index;
        while ( ( index = str.indexOf( key ) ) >= 0 ) {
          str = str.slice( 0, index ) + replacement + str.slice( index + key.length );
        }
      } );
      Object.keys( mapping ).forEach( key => {
        if ( str.indexOf( `{{${key}}}` ) >= 0 ) {
          throw new Error( `Template string detected in placeholders: ${key}\n\n${str.slice( 0, str.indexOf( `{{${key}}}` ) + 10 )}` );
        }
      } );
      return str;
    };

    const flashFilterButtonDisplay = includeFlash ? 'style=display:inline' : 'style=display:none';
    const allTabFlashBadge = includeFlash ? WeddellConstants.FLASH_BADGE : WeddellConstants.PSEUDO_FLASH_BADGE;

    // Replace placeholders in the template.
    // TODO: Remove dead code when safe to do so. See https://github.com/phetsims/weddell/issues/73.
    // grunt.log.writeln( `Html Sims: ${htmlElements.length} \nFlash Sims: ${flashElements.length} \nJava Sims: ${javaElements.length} \n` );
    const newPhetDevHtml = replacePlaceholders( grunt.file.read( homepageTemplatePath ), {
      HTML_TRANSLATED_SIMS: htmlTranslatedElements.join( '\n' ),
      HTML_UNTRANSLATED_COLLECTION: getUntranslatedCollection( htmlUntranslatedElements, 'html' ),
      FLASH_TRANSLATED_SIMS: flashTranslatedElements.join( '\n' ),
      FLASH_UNTRANSLATED_COLLECTION: getUntranslatedCollection( flashUntranslatedElements, 'flash' ),
      FLASH_LEGACY_COLLECTION: legacyFlashContent,
      JAVA_TRANSLATED_SIMS: javaTranslatedElements.join( '\n' ),
      JAVA_UNTRANSLATED_COLLECTION: getUntranslatedCollection( javaUntranslatedElements, 'java' ),
      ALL_TRANSLATED_SIMS: allTranslatedElements.join( '\n' ),
      ALL_UNTRANSLATED_COLLECTION: getUntranslatedCollection( allUntranslatedElements, 'all' ),
      HTML_BADGE: WeddellConstants.HTML_BADGE,
      FLASH_BADGE: WeddellConstants.FLASH_BADGE,
      JAVA_BADGE: WeddellConstants.JAVA_BADGE,
      FLASH_FILTER_TAB_DISPLAY_STYLE: flashFilterButtonDisplay,
      ALL_TAB_FLASH_BADGE: allTabFlashBadge
    } );
    grunt.file.write( `./assets/html/homepage_${buildLocale}.html`, newPhetDevHtml );
  } );
  grunt.log.writeln( '\nWriting config file...' );

  // Write to config file
  jsonfile.writeFileSync( './weddellConfig.json', {
    defaultLocaleAbbreviation: defaultLocale,
    localeAbbreviations: targetLocales,
    localeNames: localeNames,
    includeFlash: includeFlash,
    includeLegacyFlash: includeLegacyFlash
  }, err => {
    if ( err ) {
      grunt.log.warn( err );
    }
  } );
  grunt.log.writeln( 'Config file written.' );
};