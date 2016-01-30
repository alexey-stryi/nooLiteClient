Ext.define('nooControl.view.Bulbs', {
    extend: 'Ext.Panel',
    alias: 'widget.BulbsPanel',

    requires: [
        'Ext.TitleBar',
        'Ext.dataview.DataView',
        'nooControl.form.bulb.DataItem'
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

        items  : [{
            docked : 'top',
            xtype  : 'titlebar',
            title  : '',
            items  : [{
                iconCls : 'arrow_left',
                itemId  : 'button_back',
                align   : 'left'
            }]
        }, {
            xtype         : 'dataview',
            width         : '100%',
            height        : '100%',
            defaultType   : 'BulbDataItem',
            useComponents : true
        },{
            xtype  : 'toolbar',
            docked : 'bottom',
            layout : {
                pack : 'center',
                type : 'hbox'
            },
            defaults : {xtype : 'button', ui : 'plain'},
            items : [{
                itemId  : 'add_bulb_button',
                iconCls : 'add'
            }]
        }]
    }
});