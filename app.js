/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

Ext.application({
    name: 'nooControl',

    requires: [
        'overrides.Slider',
        'overrides.SliderToggle',
        'Ext.MessageBox'
    ],

    controllers: [
        'Main',
        'Bulb'
    ],

    views: [
        'Main'
    ],

    stores : [
        'Config',
        'Locations',
        'Bulbs'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    defaultHost : 'http://localhost:4567',

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

/*****************************************************************************/

    launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();

        this.loadConfig();

        // Initialize the main view
        Ext.Viewport.add(Ext.create('nooControl.view.Main'));
        Ext.getStore('Bulbs').load();
    },

/*****************************************************************************/

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

/*****************************************************************************/

    loadConfig : function() {
        var me = this;

        Ext.getStore('Config').load(function() {
            var store = this, host;

            host = store.getById('host') || store.add({key: 'host', value: me.defaultHost})[0];

            store.sync();

            nooControl.config = {
                host : host.get('value')
            };
        });
    },

/*****************************************************************************/

    setConfig : function(key, value) {
       var me = this, item,
           store = Ext.getStore('Config');


        item = store.getById(key) || store.add({key: key})[0];
        item.set('value', value);

        store.sync();

        if (!nooControl.config) {
            nooControl.config = {};
        }
        nooControl.config[key] = value;
    }
});
