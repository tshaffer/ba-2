angular.module('brightauthor').controller('brightauthorCtrl', ['$scope', function($scope ) {

    $scope.mediaLibraryThumbs = [];
    $scope.playlistThumbs = [];
    
    console.log("ba.js invoked");

    const remote = require('electron').remote;
    const dialog = remote.dialog;
    const Menu = remote.Menu;

    const fs = require('fs');
    var path = require('path');

// for thumbnails
    var numColumns = 2;

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
                        $scope.newProject();
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

    // initialize scope parameters
    $scope.signName = "";
    $scope.zoneName = "";
    $scope.zoneId = "";
    $scope.zoneType = "";

    $scope.newProject = function() {
        // $scope.buildMediaLibrary();
    }

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

        parseXML(xml, function (err, bpfAsJson) {
            if (err) {
                console.log(err);
                return;
            }
            parseBPF(bpfAsJson);
        });
    };

    function parseBPF(signAsJSON) {

        var sign = new Sign();
        sign.parse(signAsJSON);
        
        $scope.$apply( function() {
            $scope.signName = signAsJSON.BrightAuthor.meta[0].name[0];

            $scope.zone = signAsJSON.BrightAuthor.zones[0].zone[0];

            $scope.zoneName = $scope.zone.name[0];
            $scope.zoneId = $scope.zone.id[0];

            $scope.zoneType = $scope.zone.type[0];

            $scope.zoneSpecificParameters = $scope.zone.zoneSpecificParameters[0];
            $scope.playlist = $scope.zone.playlist[0];
        });
    }

    $scope.buildImageItemThumbs = function() {

        var dir = '/Users/tedshaffer/Documents/Projects/electron/ba-2/public';
        var suffix = "jpg";

        var thumbCount = 0;
        var columnIndex = 0;
        var imageItemThumb = {};

        var files = fs.readdirSync(dir);
        files.forEach(function(file) {

            var filePath = path.format({
                root: "/",
                dir: dir,
                base: file,
                ext: "." + suffix,
                name: "file"
            });

            var url = path.relative(dir, filePath);
            var filePath = filePath;

            var thumb = {};

            thumb.id = thumbCount.toString();
            thumb.thumbUrl = "public/" + url;
            thumb.path = url;
            thumb.fileName = file;

            thumbCount++;

            var keyColumn = "column" + columnIndex.toString();
            imageItemThumb[keyColumn] = thumb;
            columnIndex++;

            if ((columnIndex % numColumns) == 0) {
                $scope.mediaLibraryThumbs.push(imageItemThumb);
                imageItemThumb = {};
                columnIndex = 0;
            }
        });
        
        // need a thumb that tells users to drag / drop here
        var playlistThumb = {};
        playlistThumb.id = "0";
        playlistThumb.thumbUrl = $scope.mediaLibraryThumbs[0].column0.thumbUrl;
        playlistThumb.stateName = "Drop item here";
        $scope.playlistThumbs.push(playlistThumb);
    }

    $scope.buildMediaLibrary = function() {

        // for some reason, the following line prevents the thumbs from appearing
        // $scope.mediaLibraryThumbs = [];

        // if this function is invoked on startup, $apply shouldn't be called as this code is already in a digest cycle
        // $scope.$apply(function() {
            $scope.buildImageItemThumbs();
        // });
    }

    mediaLibraryDragStartHandler = function(ev) {
        console.log("dragStart");
        // Add the target element's id to the data transfer object
        // ev.dataTransfer.setData("text", ev.target.id);
        ev.dataTransfer.setData("path", ev.target.dataset.path);
        ev.dataTransfer.setData("name", ev.target.dataset.name);
        ev.dataTransfer.dropEffect = "copy";
    }

    playlistDragStartHandler = function(ev) {
        console.log("dragStart");
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text", ev.target.id);
        ev.dataTransfer.dropEffect = "move";
    }

    playlistDragOverHandler = function(ev) {
        console.log("playlistDragOverHandler");
        ev.preventDefault();
        // Set the dropEffect to move
        ev.dataTransfer.dropEffect = "move";
    }

    playlistDropHandler = function(ev) {
        
        console.log("drop");

        ev.preventDefault();

        // get playlist item to add to playlist
        var path = ev.dataTransfer.getData("path");
        var stateName = ev.dataTransfer.getData("name");
        
        // specify playlist item to drop
        var playlistThumb = {};
        playlistThumb.thumbUrl = "public/" + path;
        playlistThumb.stateName = stateName;

        // figure out where to drop it
        //      get id of playlist item that was drop target
        //      get offset that indicates how far over user dropped thumb
        //      if offset > half of thumb width, add thumb after target; otherwise insert thumb before target
        var id = ev.target.id;
        var index = Number(id);
        var offset = ev.offsetX;
        var insert = false;
        if (offset < 50) {
            insert = true;
        }

        // update scope variables
        $scope.$apply(function() {

            if (insert) {
                // insert prior to index
                $scope.playlistThumbs.splice(index, 0, playlistThumb);
            }
            else {
                // add after index
                $scope.playlistThumbs.splice(index + 1, 0, playlistThumb);
            }

            // renumber thumb id's
            $scope.playlistThumbs.forEach(function (thumb, thumbIndex) {
               thumb.id = thumbIndex.toString();
            });
        });
    }

    $scope.buildMediaLibrary();

}]);
