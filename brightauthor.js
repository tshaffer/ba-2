angular.module('brightauthor').controller('brightauthorCtrl', ['$scope', function($scope ) {

    $scope.title = "pizza";

    console.log("ba.js invoked");

//const dialog = require('electron').remote.dialog;
    const remote = require('electron').remote;
    const dialog = remote.dialog;
    const Menu = remote.Menu;

    const fs = require('fs');
    var path = require('path');

// for thumbnails
    var numColumns = 2;
    $scope.thumbs = [];

    var thumbTemplate = "";
    thumbTemplate  = "<div class='ui-grid-cell-contents'>";
    thumbTemplate += "<img ng-src=\"{{grid.getCellValue(row, col).thumbUrl}}\">";
    thumbTemplate += "</div>";

    var thumbColumns = [];

    $scope.gridOptions = {
        showHeader: false,
        modifierKeysToMultiSelectCells: true,
        rowHeight:200,
        columnDefs: thumbColumns
    };
    $scope.gridOptions.data = $scope.thumbs;

    for (i = 0; i < numColumns; i++) {
        thumbColumn = {};
        thumbColumn.name = 'image' + i.toString();
        thumbColumn.field = thumbColumn.name;
        thumbColumn.cellTemplate = thumbTemplate;

        thumbColumns.push(thumbColumn);
    }





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

    // initialize scope parameters
    $scope.signName = "";
    $scope.zoneName = "";
    $scope.zoneId = "";
    $scope.zoneType = "";

    function newProject() {
        buildMediaLibrary();
    };

    function buildMediaLibrary() {

        var suffix = "jpg";

        // get urls for thumbs
        // TBD - see tagPhotos.js, getPhotosPromise
        // in this code, each thumbUrl will be file:///
        // http://stackoverflow.com/questions/12711584/how-to-specify-a-local-file-within-html-using-the-file-scheme
        var dir = '/Users/tedshaffer/Documents/Projects/electron/ba-2/public';

        // url from shafferoto
        // http://localhost:3000/photos/testPhotos/New Orleans/IMG_1624_thumb.JPG

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

            var image = {};


            // this appears to only be the file name
            // image.thumbUrl = url;
            image.thumbUrl = "http://localhost:3000/public/" + url;

            image.width = 200;
            image.height = 200;
            image.maxHeight = 200;
            //console.log("width/height ratio is: " + (image.width / image.height).toString());

            var key = "image" + columnIndex.toString();
            imageItemThumb[key] = image;
            columnIndex++;

            if ((columnIndex % numColumns) == 0) {
                $scope.thumbs.push(imageItemThumb);
                imageItemThumb = {};
                columnIndex = 0;
            }
        });








        $scope.gridOptions.onRegisterApi = function(gridApi){
            $scope.gridApi = gridApi;
            gridApi.cellNav.on.navigate($scope,function(newRowCol, oldRowCol){
                console.log('navigation event');
            });
        };

        $scope.getCurrentSelection = function() {
            var selectedThumbs = [];
            var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
            for (var i = 0; i < currentSelection.length; i++) {
                selectedThumbs.push(currentSelection[i].row.entity[currentSelection[i].col.name]);
            }
            return selectedThumbs;
        };
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

        parseXML(xml, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            parseBPF(result);
        });
    };

    function parseBPF(signAsJSON) {

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
}]);
