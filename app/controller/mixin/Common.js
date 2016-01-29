Ext.define('nooControl.controller.mixin.Common', {

/*****************************************************************************/

    showHomeScreen: function() {
        var locationsPanel = this.getLocationsPanel();

        Ext.getStore('Locations').load(function() {
            locationsPanel.down('list').refresh();
        });

        this.getMainView().setActiveItem(locationsPanel);
    }
});