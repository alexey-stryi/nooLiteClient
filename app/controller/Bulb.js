Ext.define('nooControl.controller.Bulb', {
    extend: 'Ext.app.Controller',

    requires : [
        'Ext.ux.menu.Menu'
    ],

    mixins: {
        common : 'nooControl.controller.mixin.Common'
    },

    config: {
        control: {
            'button#add_bulb_button': {
                tap: 'onAddNewBulbTapped'
            },

            'button#bulb_settings_button': {
                tap: 'onBulbSettingsButtonTapped'
            },

            'togglefield#bulb_state_switch': {
                tap: 'onBulbStateSwitched'
            },

            'sliderfield#bulb_brightness_slider' : {
                dragend : 'onBulbBrightnessChanged',
                tap     : 'onBulbBrightnessChanged'
            },

            'button#save_bulb_button' : {
                tap : 'onSaveBulbButtonTapped'
            },

            'button#led_color_button' : {
                tap : 'onBulbColorButtonTapped'
            },

            'button#warm_white_color_button' : {
                tap : function(btn) { this.onColorPresetButtonTapped(btn, '#ffd6aa'); }
            },

            'button#halogen_white_color_button' : {
                tap : function(btn) { this.onColorPresetButtonTapped(btn, '#fff1e0'); }
            },

            'button#white_color_button' : {
                tap : function(btn) { this.onColorPresetButtonTapped(btn, '#ffffff'); }
            },

            'button#cancel_color_pick' : {
                tap : 'onCancelColorPickTapped'
            },

            'button#done_color_pick' : {
                tap : 'onDoneColorPickTapped'
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

    onAddNewBulbTapped: function() {
        var form  = this.getNewBulbForm(),
            store = Ext.getStore('Bulbs'),
            bulb  = store.add({})[0];

        form.setRecord(bulb);
        this.getMainView().setActiveItem(form);
    },

/*****************************************************************************/

    onBulbSettingsButtonTapped: function(btn) {
        var controller = this, options = [],
            dataItem   = btn.up('BulbDataItem'),
            store      = Ext.getStore('Bulbs'),
            bulb       = store.getById(dataItem._record.get('id'));

        options.push({text : 'Edit',   value: 'edit'});

        if (bulb.get('binded')) {
            options.push({text : 'Unbind',   value: 'unbind'});
        } else {
            options.push({text : 'Bind',   value: 'bind'});
        }

        options.push({text : 'Delete', value: 'delete'});

        Ext.ux.menu.Menu.open(btn, options, function(value) {
            switch (value) {
                case 'edit' :
                    controller.onBulbEditButtonTapped(dataItem, bulb);
                    break;
                case 'bind' :
                    controller.onBulbBindButtonTapped(dataItem, bulb);
                    break;
                case 'unbind' :
                    controller.onBulbUnbindButtonTapped(dataItem, bulb);
                    break;
                case 'delete' :
                    controller.onBulbDeleteButtonTapped(dataItem, bulb);
                    break;
            }
        });
    },

/*****************************************************************************/

    onBulbStateSwitched : function(fld) {
        var controller = this,
            dataItem   = fld.up('BulbDataItem'),
            store      = Ext.getStore('Bulbs'),
            bulb       = store.getById(dataItem._record.get('id')),
            state      = fld.getValue() ? 'on' : 'off';

        if (bulb) {
            bulb.set('state', state);
            this.performRequest(Ext.String.format('/{0}/state/{1}', bulb.get('id'), state), 'PUT', bulb);
        }
    },

/*****************************************************************************/

    onBulbBrightnessChanged : function(fld) {
        var controller = this,
            dataItem   = fld.up('BulbDataItem'),
            store      = Ext.getStore('Bulbs'),
            bulb       = store.getById(dataItem._record.get('id')),
            brightness = fld.getValue()[0];

        if (bulb) {
            bulb.set('brightness', brightness);
            this.performRequest(Ext.String.format('/{0}/brightness/{1}', bulb.get('id'), brightness), 'PUT', bulb);
        }
    },

/*****************************************************************************/

    onBulbEditButtonTapped : function(dataItem, bulb) {
        this.getNewBulbForm().setRecord(bulb);
        this.getMainView().setActiveItem(1);
    },

/*****************************************************************************/

    onBulbBindButtonTapped : function(dataItem, bulb) {
        var controller = this,
            store      = Ext.getStore('Bulbs');

        if (!bulb) {
            return;
        }
        bulb.set('binded', true);

        this.performRequest(Ext.String.format('/{0}/', bulb.get('id')), 'LINK', bulb);
    },

/*****************************************************************************/

    onBulbUnbindButtonTapped : function(dataItem, bulb) {
        var controller = this,
            store      = Ext.getStore('Bulbs');

        if (!bulb) {
            return;
        }
        bulb.set('binded', false);

        this.performRequest(Ext.String.format('/{0}/', bulb.get('id')), 'UNLINK', bulb);
    },

/*****************************************************************************/

    onBulbDeleteButtonTapped : function(dataItem, bulb) {
        var store = Ext.getStore('Bulbs');

        if (bulb.get('binded')) {
            return Ext.Msg.alert('Bulb is binded', 'You need to unbind it first!');
        }

        store.remove(bulb);
        store.sync();
        dataItem.parent.remove(dataItem);
    },

/*****************************************************************************/

    onSaveBulbButtonTapped : function(btn) {
        var controller = this,
            form   = this.getNewBulbForm(),
            store  = Ext.getStore('Bulbs'),
            bulb   = store.getById(form.getRecord().get('id'));

        bulb.set(form.getValues());

        store.sync({
            success : function() {
                controller.showHomeScreen();
            }
        });
    },

/*****************************************************************************/

    onBulbColorButtonTapped : function(btn) {
        var controller = this,
            dataItem   = btn.up('BulbDataItem'),
            store      = Ext.getStore('Bulbs'),
            bulb       = store.getById(dataItem._record.get('id'));

        if (!this.overlay) {
            this.overlay = Ext.Viewport.add({
                xtype  : 'ColorPicker'
            });
        }

        this.overlay.show();
        this.overlay.setRecord(bulb);
    },

/*****************************************************************************/

    onColorPresetButtonTapped : function(btn, color) {
        if (this.overlay) {
            this.overlay.setColor(color);
        }
    },

/*****************************************************************************/

    onCancelColorPickTapped : function(btn) {
        if (this.overlay) {
            this.overlay.hide();
        }
    },

/*****************************************************************************/

    onDoneColorPickTapped : function(btn) {
        var store = Ext.getStore('Bulbs'), record, bulb, color;

        if (!this.overlay) {
            return;
        }

        record = this.overlay.getRecord();

        if (!record) {
            return;
        }

        color = this.overlay.getColor();
        bulb  = store.getById(record.get('id'));

        if (bulb) {
            bulb.set('color', color);
            this.performRequest(Ext.String.format('/{0}/color/{1}', bulb.get('id'), color), 'PUT', bulb);
        }

        this.overlay.hide();
    },

/*****************************************************************************/

    performRequest : function(url, method, bulb) {
        var controller = this,
            store      = Ext.getStore('Bulbs');

        Ext.Ajax.request({
            url    : store._proxy._url + url,
            method : method,
            failure: function() {
                bulb.reject();
                controller.processFailure.apply(controller, arguments);
            },
            success : function() {
                bulb.commit();
            }
        });
    },

/*****************************************************************************/

    processFailure : function(response, opts) {
        var result = Ext.decode(response.responseText, true);

        if (result.reason === 'error' && result.message) {
            Ext.Msg.alert('An error has occurred', result.message);
        }
    }
});


