Ext.define('nooControl.form.bulb.New', {
    extend: 'Ext.form.Panel',
    alias: 'widget.NewBulbPanel',

    requires: [
        'Ext.TitleBar',
        'Ext.field.Text',
        'Ext.field.Select'
    ],

/*****************************************************************************/

    config: {
        // hideAnimation: {
            // type      : 'slide',
            // direction : 'right',
            // out       : true
        // },
        showAnimation:  {
            type      : 'slide',
            direction : 'left',
            out       : false
        },

        items : [{
            docked: 'top',
            xtype: 'titlebar',
            title: 'Add bulb',
            items: [{
                iconCls : 'arrow_left',
                itemId  : 'button_back',
                align   : 'left'
            }]
        },{
            xtype      : 'textfield',
            name       : 'name',
            labelAlign : 'top',
            label      : 'Name',
            allowBlank : false,
            autoComplete : false
        },{
            xtype      : 'textfield',
            name       : 'location',
            labelAlign : 'top',
            label      : 'Location',
            allowBlank : false,
            autoComplete : false
        },{
            xtype      : 'selectfield',
            name       : 'type',
            labelAlign : 'top',
            label      : 'Type',
            allowBlank : false,
            options    : [
                {text: 'Switch', value: 'switch'},
                {text: 'Button', value: 'button'},
                {text: 'Dimmer', value: 'dimmer'},
                {text: 'LED',    value: 'led'}
            ]
        },{
            xtype  : 'toolbar',
            docked : 'bottom',
            layout : {
                pack : 'center',
                type : 'hbox'
            },
            items : [{
                xtype   : 'button',
                itemId  : 'save_bulb_button',
                iconCls : 'check2',
                ui      : 'plain'
            }]
        }]
    }
});