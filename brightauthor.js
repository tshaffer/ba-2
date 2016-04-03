angular.module('brightauthor').controller('brightauthorCtrl', ['$scope', function($scope ) {

    $scope.title = "pizza";

    console.log("ba.js invoked");

//const dialog = require('electron').remote.dialog;
    const remote = require('electron').remote;
    const dialog = remote.dialog;
    const Menu = remote.Menu;

    const fs = require('fs');

    var parseXML = require('xml2js').parseString;

    var baTemplate = [

        {
            label: 'File',
            submenu: [
                {
                    label: 'New Presentation',
                    accelerator: 'Command+N',
                    click: function() {
                        console.log("newProject clicked");
                        newProject();
                    }
                },
                {
                    label: 'Open Presentation',
                    accelerator: 'Command+O',
                    click: function() {
                        console.log("openProject clicked");
                        openProject();
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: function() {
                        remote.app.quit();
                    }
                    //click: function() { remote.app.quit(); }
                },
            ]
        }
    ];

    var template = [
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectall'
                },
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: function(item, focusedWindow) {
                        if (focusedWindow)
                            focusedWindow.reload();
                    }
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: (function() {
                        if (process.platform == 'darwin')
                            return 'Ctrl+Command+F';
                        else
                            return 'F11';
                    })(),
                    click: function(item, focusedWindow) {
                        if (focusedWindow)
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: (function() {
                        if (process.platform == 'darwin')
                            return 'Alt+Command+I';
                        else
                            return 'Ctrl+Shift+I';
                    })(),
                    click: function(item, focusedWindow) {
                        if (focusedWindow)
                            focusedWindow.toggleDevTools();
                    }
                },
            ]
        },
        {
            label: 'Window',
            role: 'window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                },
            ]
        },
        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: function() { require('electron').shell.openExternal('http://electron.atom.io') }
                },
            ]
        },
    ];

    if (process.platform == 'darwin') {
        var name = require('electron').remote.app.getName();
        baTemplate.unshift({
            label: name,
            submenu: [
                {
                    label: 'About ' + name,
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Services',
                    role: 'services',
                    submenu: []
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Hide ' + name,
                    accelerator: 'Command+H',
                    role: 'hide'
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Alt+H',
                    role: 'hideothers'
                },
                {
                    label: 'Show All',
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: function() { app.quit(); }
                },
            ]
        });
        // Window menu.
        //baTemplate[3].submenu.push(
        //    {
        //        type: 'separator'
        //    },
        //    {
        //        label: 'Bring All to Front',
        //        role: 'front'
        //    }
        //);
    }

    var menu = Menu.buildFromTemplate(baTemplate);
    console.log("create menu object");
    Menu.setApplicationMenu(menu);
    console.log("set application menu");

    function newProject() {

    };

    function openProject() {

        console.log("openProject");

        //dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]});
        var options = {};
        options.title = 'Open Project';
        options.properties =  ['openFile'];
        options.filters = [
            { name: 'BrightAuthor Project Files', extensions: ['bpf'] }
        ];

        var baProjectFilePath;
        var baProjectFilePaths = dialog.showOpenDialog(options);

        if (baProjectFilePaths.length == 0) {
            console.log("No path selected");
            return;
        }
        else {
            baProjectFilePath = baProjectFilePaths[0];
            console.log("selected project is: " + baProjectFilePath);
        }

        console.log("open project file");
        fs.readFile(baProjectFilePath, 'utf8', function(err, data) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(baProjectFilePath + " read");
            parseProjectFile(data);
        });
    };

    function parseProjectFile(xml) {

        parseXML(xml, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
        });
    };
}]);
