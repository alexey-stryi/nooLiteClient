Ext.define('nooControl.model.Config', {
    extend : 'Ext.data.Model',

    config : {
        idProperty : 'key',
        fields     : ['key', 'value'],
        proxy      : {
            type: 'localstorage',
            id  : 'noolite-control-config'
        }
    }
});
