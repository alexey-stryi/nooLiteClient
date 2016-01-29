Ext.define('nooControl.view.Main', {
    extend: 'Ext.Panel',
    
    xtype: 'main',

    requires: [
        'nooControl.view.Locations',
        'nooControl.view.Settings',
        'nooControl.view.Bulbs',        
        'nooControl.form.bulb.New'
    ],
    config: {   
        layout: 'card',
        
        items: [{
            xtype : 'LocationsPanel'
        },{
            xtype : 'NewBulbPanel'
        },{
            xtype : 'SettingsPanel'
        },{
            xtype : 'BulbsPanel'
        }]
    }
});
