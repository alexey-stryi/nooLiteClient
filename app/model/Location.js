Ext.define('nooControl.model.Location', {
    extend : 'Ext.data.Model',
    
    requires : [
        'nooControl.model.Bulb'
    ],
    
    config : {
        idProperty : 'name',
        fields     : ['name', 'bulbs_list_url'],
        hasMany    : [
            {model: 'nooControl.model.Bulb', name: 'bulbs'}
        ]
    }
});
