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
            },

            'button#led_start_roll_button': {
                tap: 'onBulbStartRollButtonTapped'
            },

            'button#led_stop_roll_button': {
                tap: 'onBulbStopRollButtonTapped'
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
            bulb  = store.add({})[0],
            bulbsPanel = this.getBulbsPanel();

        if (this.getMainView().getActiveItem() === bulbsPanel) {
            bulb.set('location', bulbsPanel.down('titlebar').getTitle());
        }

        form.setRecord(bulb);
        this.getMainView().setActiveItem(form);
    },

/*****************************************************************************/

    onBulbSettingsButtonTapped: function(btn) {
        var controller = this,
            dataItem   = btn.up('BulbDataItem'),
            store      = Ext.getStore('Bulbs'),
            bulb       = store.getById(dataItem._record.get('id')),
            options    = controller.getMenuOptions(bulb);

        Ext.ux.menu.Menu.open(btn, options, function(value, menuItem) {
            switch (value) {
                case 'edit' :
                    controller.onBulbEditButtonTapped(bulb);
                    break;
                case 'bind' :
                    controller.onBulbBindButtonTapped(bulb, menuItem.config.channel);
                    break;
                case 'unbind' :
                    controller.onBulbUnbindButtonTapped(bulb, menuItem.config.channel);
                    break;
                case 'delete' :
                    controller.onBulbDeleteButtonTapped(bulb, dataItem);
                    break;
            }
        });
    },

/*****************************************************************************/

    getMenuOptions : function(bulb) {
        var binded   = bulb.get('binded'), options = [],
            channels = bulb.get('channels');

        options.push({text : 'Edit',   value: 'edit'});

        Ext.Array.each(channels, function(ch, idx) {
            var action = binded[ch] ? 'Unbind' : 'Bind',
                extra  = channels.length > 1 ? (idx === 0 ? 'main' : 'LED')  : '',
                text   = Ext.String.format('{0} {1}', action, extra).trim();

            options.push({text : text,  value: action.toLowerCase(), channel : ch});
        });

        options.push({text : 'Delete', value: 'delete'});

        return options;
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

    onBulbEditButtonTapped : function(bulb) {
        this.getNewBulbForm().setRecord(bulb);
        this.getMainView().setActiveItem(1);
    },

/*****************************************************************************/

    onBulbBindButtonTapped : function(bulb, channel) {
        var binded = bulb.get('binded');

        if (typeof(binded) !== "object") {
            binded = {};
        }
        binded[channel] = 1;

        bulb.set('binded', binded);

        this.performRequest(Ext.String.format('/{0}/{1}', bulb.get('id'), channel), 'LINK', bulb);
    },

/*****************************************************************************/

    onBulbUnbindButtonTapped : function(bulb, channel) {
        var binded = bulb.get('binded');

        if (typeof(binded) !== "object") {
            binded = {};
        }
        binded[channel] = 0;

        bulb.set('binded', binded);

        this.performRequest(Ext.String.format('/{0}/{1}', bulb.get('id'), channel), 'UNLINK', bulb);
    },

/*****************************************************************************/

    onBulbDeleteButtonTapped : function(bulb, dataItem) {
        var store = Ext.getStore('Bulbs');

        if (bulb.isBinded()) {
            return Ext.Msg.alert('Bulb is binded', 'You need to unbind it first!');
        }

        Ext.Msg.confirm('Delete', 'Are you sure?', function(btn) {
            if (btn === 'yes') {
                store.remove(bulb);
                store.sync({
                    success : function() {
                        Ext.Msg.alert('Delete', Ext.String.format('Bulb "{0}" has been deleted', bulb.get('name')));
                    }
                });
                dataItem.parent.remove(dataItem);
            }
        });
    },

/*****************************************************************************/

    onSaveBulbButtonTapped : function(btn) {
        var controller = this,
            form   = this.getNewBulbForm(),
            store  = Ext.getStore('Bulbs'),
            bulb   = store.getById(form.getRecord().get('id'));

        bulb.set(form.getValues());

        if (!bulb.dirty) {
            return controller.showHomeScreen();
        }

        if (!bulb.isValid()) {
            return Ext.Msg.alert('Validation failed', 'Some field values are invalid or missing!');
        }

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

    onBulbStartRollButtonTapped : function(btn) {
        var controller = this,
            dataItem   = btn.up('BulbDataItem'),
            store      = Ext.getStore('Bulbs'),
            bulb       = store.getById(dataItem._record.get('id'));

        if (bulb) {
            this.performRequest(Ext.String.format('/{0}/command/{1}', bulb.get('id'), 'roll'), 'PUT', bulb);
        }
    },

/*****************************************************************************/

    onBulbStopRollButtonTapped : function(btn) {
        var controller = this,
            dataItem   = btn.up('BulbDataItem'),
            store      = Ext.getStore('Bulbs'),
            bulb       = store.getById(dataItem._record.get('id'));

        if (bulb) {
            this.performRequest(Ext.String.format('/{0}/command/{1}', bulb.get('id'), 'stop'), 'PUT', bulb);
        }
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
