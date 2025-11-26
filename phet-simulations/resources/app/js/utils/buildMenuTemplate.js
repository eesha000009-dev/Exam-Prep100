// Copyright 2020, University of Colorado Boulder
/**
 * Responsible for templating the application drop down menu.
 *
 * @author Denzell Barnett (PhET Simulations Interactive)
 */

const { app } = require( 'electron' ); // eslint-disable-line require-statement-match

module.exports = addLocalesToTemplate => {

  // Responsible for templating the application drop down menu.
  return [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Relaunch', click() {
            app.relaunch();
            app.exit();
          },
          accelerator: 'CmdOrCtrl+Shift+R'
        },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { type: 'separator' },
        {
          label: 'Quit', click() {
            app.quit();
          },
          accelerator: 'Cmd+Q'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload'
        },
        {
          role: 'toggledevtools'
        },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },

        // Hacky solution until accelerator aliases are released.
        // Keep one menuItem around that is invisible with a different accelerator
        {
          role: 'zoomin',
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus'
        }, {
          role: 'zoomin',
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+=',
          visible: false
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      role: 'locales',
      label: 'Locale',
      submenu: addLocalesToTemplate
    }
  ];
};