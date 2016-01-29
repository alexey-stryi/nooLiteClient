Ext.define('nooControl.store.Config', {
    extend: 'Ext.data.Store',

    requires: [
        'nooControl.model.Config'
    ],

    config : {
        model   : 'nooControl.model.Config'
    }
});
