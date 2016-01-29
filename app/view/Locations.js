Ext.define('nooControl.view.Locations', {
    extend: 'Ext.Panel',
    alias: 'widget.LocationsPanel',

    requires: [
        'nooControl.model.Location',
        'nooControl.store.Locations',
        'Ext.TitleBar',
        'Ext.dataview.List',
        'Ext.plugin.PullRefresh'
    ],

/*****************************************************************************/

    config: {
        hideAnimation: {
            type: 'slide',
            direction: 'left',
            out: true
        },
        showAnimation:  {
            type: 'slide',
            direction: 'right',
            out: false
        },


        items  : [{
            docked : 'top',
            xtype  : 'titlebar',
            title  : 'nooLite Control'
        }, {
            xtype   : 'list',
            itemId  : 'locations_list',
            width   : '100%',
            height  : '100%',
            store   : 'Locations',
            plugins: [{
                xclass: 'Ext.plugin.PullRefresh',
                pullText: 'Pull down to refresh'
            }],
            
            itemTpl : '{name}'
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
                iconCls : 'add',
                flex    : 1
            },{
                disabled : true,
                width    : 10,
                cls      : 'separator'
            },{
                itemId  : 'settings_button',
                iconCls : 'settings2',
                flex    : 1
            }]
        }]
    },

/*****************************************************************************/

    initialize : function() {
        var me = this,
            list = me.down('list');

        if (list) {
            list._store.load();
        }
    }
});