Ext.define('nooControl.store.Bulbs', {
    extend   : 'nooControl.store.AbstractStore',

    config : {
        model   : 'nooControl.model.Bulb',
        url     : '/bulbs'
    },
    noPages : true
});
