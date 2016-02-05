Ext.define('nooControl.form.bulb.DataItem', {
    extend: 'Ext.dataview.component.DataItem',
    alias: 'widget.BulbDataItem',

    requires: [
        'nooControl.model.Bulb',
        'nooControl.form.bulb.ColorPicker',
        'Ext.field.Toggle'
    ],

/*****************************************************************************/

    config: {
        margin : '20 10',
        width  : '95%',

        items : [{
            xtype  : 'toolbar',
            docked : 'top',
            ui: 'light',
            layout : {
                type : 'hbox'
            },
            items : [{
                xtype   : 'component',
                itemId  : 'bulb_name',
                cls     : 'bulb-data-item-text',
                width   : 170,
                padding : 10
            },{
                xtype : 'spacer'
            },{
                xtype  : 'togglefield',
                itemId : 'bulb_state_switch',
                width  : 100
            },{
                xtype   : 'button',
                ui      : 'plain',
                iconCls : 'settings',
                itemId  : 'bulb_settings_button'
            }]
        },{
            xtype : 'panel',
            items : [{
                xtype: 'sliderfield',
                itemId: 'bulb_brightness_slider',
                label: 'Brightness',
                minValue: 0,
                maxValue: 100
            },{
                xtype    : 'container',
                itemId   : 'led_bulb_extras',
                layout   : { pack : 'center', type: 'hbox' },
                margin   : 10,
                defaults : {flex: 1},
                items    : [{
                    xtype  : 'container',
                    layout : { pack : 'center', type: 'hbox' },
                    items  : {
                        xtype  : 'button',
                        itemId : 'led_color_button',
                        text   : 'Color'
                    }
                },{
                    xtype  : 'container',
                    layout : { pack : 'center', type: 'hbox' },
                    items  : {
                        xtype  : 'button',
                        itemId : 'led_start_roll_button',
                        text   : 'Roll'
                    }
                },{
                    xtype  : 'container',
                    layout : { pack : 'center', type: 'hbox' },
                    items  : {
                        xtype  : 'button',
                        itemId : 'led_stop_roll_button',
                        text   : 'Stop'
                    }
                }]
            }]
        }]
    },

/*****************************************************************************/

    updateRecord: function(record) {
        var me   = this;

        if (!record) {
            return;
        }

        me.down('#bulb_name').setHtml(record.get('name'));
        me.down('#bulb_name').setDisabled(!record.isBinded());
        me.down('#bulb_state_switch').setValue(record.get('state') === 'on');

        switch (record.get('type')) {
            case 'led':
                me.down('#led_bulb_extras').show();
                me.down('#bulb_brightness_slider').show();
                me.down('#bulb_brightness_slider').setValue(record.get('brightness'));
                break;
            case 'dimmer':
                me.down('#bulb_brightness_slider').show();
                me.down('#bulb_brightness_slider').setValue(record.get('brightness'));
                break;
            default:
                me.down('#led_bulb_extras').hide();
                me.down('#bulb_brightness_slider').hide();
        }

        me.callParent(arguments);
    }
});