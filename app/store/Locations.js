Ext.define('nooControl.store.Locations', {
    extend   : 'nooControl.store.AbstractStore',

    config : {
        model   : 'nooControl.model.Location',
        url     : '/locations/'
    },
    noPages : true
});
