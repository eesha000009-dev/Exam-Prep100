// Copyright 2020, University of Colorado Boulder
/**
 * Constants used throughout the app's build processes and runtime.
 *
 * @author Denzell Barnett (PhET Simulations Interactive)
 * @author Liam Mulhall
 */

const WeddellConstants = {

  // Common directories and file names
  CONFIG_DIRECTORY: './weddellConfig.json',
  TEMP_DIR: './temp',
  PROJECT_DIRECTORY: './project',
  RESOURCE_DIRECTORY: './resources',
  ASSETS_DIRECTORY: './assets',
  BUILD_DIRECTORY: './build/dev',

  // Directories or files that should be excluded from build artifacts
  FLASH_SIM_EXCLUDE: [ 'density-and-buoyancy', 'calculus-grapher', 'collision-lab', 'estimation',
    'geometric-optics', 'lunar-lander', 'my-solar-system', 'normal-modes', 'radiating-charge', 'resonance', 'stern-gerlach' ],

  // Set of features that require special workarounds.
  ADAPTER_FEATURE_ENUM: Object.freeze( { Flash: 'FLASH', Java: 'JAVA', MacOS: 'MacOS' } ),

  // Badge icons for html template
  HTML_BADGE: `<div class="badge-holder">
                 <svg class="badge" version="1.1" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25" enable-background="new 0 0 25 25">
                  <g><g><path d="M25,23c0,1.104-0.896,2-2,2H2c-1.104,0-2-0.896-2-2V2c0-1.104,0.896-2,2-2h21c1.104,0,2,0.896,2,2V23z"></path>
                    </g>
                    <g>
                      <path fill="#FFFFFF" d="M21.375,2.5l-1.601,17.979L12.55,22.5l-7.177-2.021L3.774,2.5H21.375z M18.101,6.174H7.05l0.588,6.677
   h7.649l-0.273,2.851l-2.464,0.662l-2.45-0.662l-0.161-1.75H7.75l0.275,3.477l4.525,1.248h0.049v-0.012l4.487-1.236l0.628-6.803
   H9.661L9.475,8.362H17.9L18.101,6.174z"></path>
                   </g>
                  </g>
                </svg>
              </div>`,
  FLASH_BADGE:
    `<div class="badge-holder">
                  <svg class="badge" version="1.1" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25" enable-background="new 0 0 25 25" role="img"><title>Flash</title><g><rect x="1" y="1" fill="#FFFFFF" width="23" height="23"></rect><g><path d="M2,0C0.9,0,0,0.9,0,2v21c0,1.1,0.9,2,2,2h21c1.1,0,2-0.9,2-2V2c0-1.1-0.9-2-2-2H2z M24,22c0,1.1-0.9,2-2,2H3
                   c-1.1,0-2-0.9-2-2V3c0-1.1,0.9-2,2-2h19c1.1,0,2,0.9,2,2V22z"></path></g><g><path fill-rule="evenodd" clip-rule="evenodd" d="M4.122,18.599c2.713-0.244,4.103-2.092,5.208-4.137
                   c0.875-1.623,1.511-3.383,2.195-5.107c0.962-2.422,2.351-4.473,4.706-5.756c1.454-0.789,2.986-1.057,4.648-0.932
                   c0,1.256,0,2.477,0,3.773c-1.432-0.104-2.638,0.42-3.658,1.404c-0.67,0.656-1.16,1.42-1.588,2.381
                   c1.1,0.061,2.131,0.121,3.191,0.18c0,1.232,0,2.457,0,3.768c-0.853,0.033-1.7,0.074-2.551,0.104c-0.582,0.014-1.165,0.014-1.745,0
                   c-0.307-0.008-0.478,0.076-0.633,0.371c-0.62,1.17-1.197,2.371-1.948,3.451c-1.774,2.543-4.279,3.908-7.354,4.234
                   c-0.192,0.023-0.462,0.117-0.466-0.229C4.118,20.944,4.122,19.78,4.122,18.599z"></path></g></g>;
                  </svg>
                </div>`,
  JAVA_BADGE:
    `<div class="badge-holder">
                <svg class="badge" version="1.1" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25" enable-background="new 0 0 25 25" role="img"><title>Java</title><g><rect x="1" y="1" fill="#FFFFFF" width="23" height="23"></rect><g><g><path d="M10.017,17.674c0,0-0.723,0.42,0.516,0.561c1.499,0.174,2.264,0.145,3.918-0.164c0,0,0.432,0.273,1.038,0.506
                 C11.786,20.166,7.109,18.484,10.017,17.674"></path><path d="M9.564,15.602c0,0-0.812,0.602,0.428,0.729c1.601,0.166,2.867,0.18,5.052-0.242c0,0,0.309,0.307,0.783,0.477
                 C11.348,17.875,6.357,16.666,9.564,15.602"></path><path d="M13.382,12.088c0.909,1.051-0.243,1.996-0.243,1.996s2.316-1.195,1.254-2.695c-0.995-1.396-1.758-2.092,2.372-4.484
                 C16.765,6.904,10.286,8.521,13.382,12.088"></path><path d="M18.282,19.205c0,0,0.534,0.439-0.592,0.781c-2.139,0.65-8.899,0.846-10.777,0.027c-0.675-0.295,0.59-0.701,0.991-0.785
                 c0.412-0.094,0.65-0.076,0.65-0.076C7.8,18.621,3.7,20.191,6.473,20.639C14.024,21.867,20.239,20.09,18.282,19.205"></path><path d="M10.364,13.455c0,0-3.439,0.816-1.218,1.111c0.94,0.129,2.808,0.102,4.55-0.049c1.425-0.115,2.852-0.373,2.852-0.373
                 s-0.504,0.215-0.864,0.463c-3.495,0.918-10.24,0.494-8.298-0.449C9.029,13.365,10.364,13.455,10.364,13.455"></path><path d="M16.533,16.9c3.551-1.844,1.907-3.613,0.765-3.373c-0.281,0.057-0.407,0.107-0.407,0.107s0.105-0.164,0.304-0.236
                 c2.266-0.797,4.01,2.352-0.731,3.598C16.462,16.996,16.519,16.949,16.533,16.9"></path><path d="M14.394,3.041c0,0,1.965,1.965-1.866,4.988c-3.069,2.428-0.698,3.811,0,5.393c-1.793-1.619-3.11-3.043-2.225-4.369
                 C11.595,7.107,15.186,6.16,14.394,3.041"></path><path d="M10.713,21.902c3.407,0.217,8.643-0.123,8.765-1.734c0,0-0.24,0.609-2.817,1.096c-2.909,0.547-6.498,0.486-8.623,0.137
                 C8.039,21.4,8.475,21.762,10.713,21.902"></path></g></g><g><path d="M2,0C0.9,0,0,0.9,0,2v21c0,1.1,0.9,2,2,2h21c1.1,0,2-0.9,2-2V2c0-1.1-0.9-2-2-2H2z M24,22c0,1.1-0.9,2-2,2H3
                 c-1.1,0-2-0.9-2-2V3c0-1.1,0.9-2,2-2h19c1.1,0,2,0.9,2,2V22z"></path></g></g>;
                 </svg>
              </div>`,
  PSEUDO_FLASH_BADGE:
    `<div class="badge-holder" style='display:none'>
                  <svg class="badge" version="1.1" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25" enable-background="new 0 0 25 25" role="img"><title>Flash</title><g><rect x="1" y="1" fill="#FFFFFF" width="23" height="23"></rect><g><path d="M2,0C0.9,0,0,0.9,0,2v21c0,1.1,0.9,2,2,2h21c1.1,0,2-0.9,2-2V2c0-1.1-0.9-2-2-2H2z M24,22c0,1.1-0.9,2-2,2H3
                   c-1.1,0-2-0.9-2-2V3c0-1.1,0.9-2,2-2h19c1.1,0,2,0.9,2,2V22z"></path></g><g><path fill-rule="evenodd" clip-rule="evenodd" d="M4.122,18.599c2.713-0.244,4.103-2.092,5.208-4.137
                   c0.875-1.623,1.511-3.383,2.195-5.107c0.962-2.422,2.351-4.473,4.706-5.756c1.454-0.789,2.986-1.057,4.648-0.932
                   c0,1.256,0,2.477,0,3.773c-1.432-0.104-2.638,0.42-3.658,1.404c-0.67,0.656-1.16,1.42-1.588,2.381
                   c1.1,0.061,2.131,0.121,3.191,0.18c0,1.232,0,2.457,0,3.768c-0.853,0.033-1.7,0.074-2.551,0.104c-0.582,0.014-1.165,0.014-1.745,0
                   c-0.307-0.008-0.478,0.076-0.633,0.371c-0.62,1.17-1.197,2.371-1.948,3.451c-1.774,2.543-4.279,3.908-7.354,4.234
                   c-0.192,0.023-0.462,0.117-0.466-0.229C4.118,20.944,4.122,19.78,4.122,18.599z"></path></g></g>;
                  </svg>
                </div>`,
  LEGACY_FLASH_CONTENT: `
  <li>
              <a class="tile flash list" href="../../resources/simulations/flash/density-and-buoyancy/buoyancy_en.html">
                <div class="image-holder"><img class="thumbnail" width="210" height="140" src="../../resources/simulations/flash/density-and-buoyancy/buoyancy-600.png"></div>
                <div class="information">
                  <div class="title-holder"><span class="title">Buoyancy</span></div>
                  <div class="icons">
                    <div class="badge-holder">
                  <svg class="badge" version="1.1" x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25" enable-background="new 0 0 25 25" role="img"><title>Flash</title><g><rect x="1" y="1" fill="#FFFFFF" width="23" height="23"></rect><g><path d="M2,0C0.9,0,0,0.9,0,2v21c0,1.1,0.9,2,2,2h21c1.1,0,2-0.9,2-2V2c0-1.1-0.9-2-2-2H2z M24,22c0,1.1-0.9,2-2,2H3
                   c-1.1,0-2-0.9-2-2V3c0-1.1,0.9-2,2-2h19c1.1,0,2,0.9,2,2V22z"></path></g><g><path fill-rule="evenodd" clip-rule="evenodd" d="M4.122,18.599c2.713-0.244,4.103-2.092,5.208-4.137
                   c0.875-1.623,1.511-3.383,2.195-5.107c0.962-2.422,2.351-4.473,4.706-5.756c1.454-0.789,2.986-1.057,4.648-0.932
                   c0,1.256,0,2.477,0,3.773c-1.432-0.104-2.638,0.42-3.658,1.404c-0.67,0.656-1.16,1.42-1.588,2.381
                   c1.1,0.061,2.131,0.121,3.191,0.18c0,1.232,0,2.457,0,3.768c-0.853,0.033-1.7,0.074-2.551,0.104c-0.582,0.014-1.165,0.014-1.745,0
                   c-0.307-0.008-0.478,0.076-0.633,0.371c-0.62,1.17-1.197,2.371-1.948,3.451c-1.774,2.543-4.279,3.908-7.354,4.234
                   c-0.192,0.023-0.462,0.117-0.466-0.229C4.118,20.944,4.122,19.78,4.122,18.599z"></path></g></g>;
                  </svg>
                </div>
                  </div>
                </div>
              </a>
            </li>
  `,

  /*
   * We make an ISO date (YYYY-MM-DD) directory for each development deploy, so we need to (1) SSH, (2) change
   * directory, (3) make the ISO date directory, and (4) SCP the files. Hence multiple constants.
   */
  DEVELOPMENT_DEPLOY_SERVER: 'phet-admin@bayes.colorado.edu',
  DEVELOPMENT_DEPLOY_PATH: '/data/web/htdocs/dev/weddell/dist',

  // where development deploys go
  DEVELOPMENT_DEPLOY_DESTINATION: 'phet-admin@bayes.colorado.edu:/data/web/htdocs/dev/weddell/dist',

  // where production deploys go (we just scp the files here)
  PHET_SERVER_PRODUCTION_DEPLOY_DESTINATION: 'phet-admin@phet-server.int.colorado.edu:/data/web/static/phetsims/files/offline-access',

  // TODO: See https://github.com/phetsims/weddell/issues/88.
  PHET_SERVER2_PRODUCTION_DEPLOY_DESTINATION: 'phet-admin@phet-server2.int.colorado.edu:/data/web/static/phetsims/files/offline-access'
};

module.exports = WeddellConstants;