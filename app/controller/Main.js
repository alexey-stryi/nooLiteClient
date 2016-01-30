Ext.define('nooControl.controller.Main', {
    extend: 'Ext.app.Controller',

    mixins: {
        common: 'nooControl.controller.mixin.Common'
    },


    config: {
        control: {
            'button#settings_button': {
                tap: 'onSettingsTapped'
            },

            'button#button_back': {
                tap: 'onBackButtonTapped'
            },

            'button#save_settings_button' : {
                tap : 'onSaveSettingsButtonTapped'
            },

            'list#locations_list' : {
                itemtap : 'onLocationsListItemTapped'
            }
        },

        refs: {
            mainView       : '[xtype=main]',
            locationsPanel : 'LocationsPanel',
            settingsPanel  : 'SettingsPanel',
            bulbsPanel     : 'BulbsPanel',
            newBulbForm    : 'NewBulbPanel'
        }
    },

/*****************************************************************************/

    onSettingsTapped: function() {
        var settingsPanel = this.getSettingsPanel();

        this.getMainView().setActiveItem(settingsPanel);

        settingsPanel.setValues(nooControl.config);
        settingsPanel.validateHostField();
    },

/*****************************************************************************/

    onBackButtonTapped : function() {
        Ext.getStore('Bulbs').rejectChanges();
        this.showHomeScreen();
    },

/*****************************************************************************/

    onLocationsListItemTapped : function(list, idx, target, record) {
        var bulbsPanel = this.getBulbsPanel();

        bulbsPanel.down('titlebar').setTitle(record.get('name'));
        bulbsPanel.down('dataview').setStore(record.bulbs());

        this.getMainView().setActiveItem(3);
    },

/*****************************************************************************/

    onSaveSettingsButtonTapped : function(btn) {
        var fld   = this.getSettingsPanel().down('urlfield'),
            value = fld.getValue(),
            dirty = fld.isDirty();

        if (!dirty) {
            return this.showHomeScreen();
        }

        if (fld.valid) {
            nooControl.app.setConfig('host', value);
            this.showHomeScreen();
        } else {
            Ext.Msg.alert('Validation', 'Please provide a valid URL<br/>(http://192.168.1.1)');
        }
    }
});