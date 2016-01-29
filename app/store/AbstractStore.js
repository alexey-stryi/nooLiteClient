/**
 * Custom store, with doSarch function for search on specific fields
 */
Ext.define('nooControl.store.AbstractStore', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.proxy.Rest'
    ],

/*****************************************************************************/

    constructor: function(cfg) {
        var me = this;

        cfg.proxy = Ext.applyIf(cfg.proxy || {}, {
          type        : 'rest',
          url         : cfg.url || me.config.url,
          extraParams : cfg.extraParams || me.config.extraParams,
          withCredentials     : true,
          useDefaultXhrHeader : false,
          reader : {
              rootProperty : 'data',
              messageProperty: 'errorMessage'
          },
          writer : {
              type           : 'json',
              encode         : true,
              writeAllFields : false
          }
        });

        me.callParent(arguments);

        me.on('beforeload', me.onBeforeLoad, me);
    },

/*****************************************************************************/
    /**
     * Stores 'Before Load' event handler
     * Checks stores 'noPages' param and removes start/limit/page attributes
     * from the given operation
     */
    onBeforeLoad : function(store, operation) {
        var url = store.initialConfig.proxy.url;
            reg = new RegExp('^' + nooControl.config.host);

        if (nooControl.config && nooControl.config.host && !url.match(reg)) {
            store._proxy._url = Ext.String.format('{0}{1}', nooControl.config.host, url);
        }

        if (store.noPages) {
            delete operation._start;
            delete operation._limit;
            delete operation._page;
        }

        return true;
    },

/*****************************************************************************/

    rejectChanges : function() {
        var me   = this, rec,
            recs = me.getNewRecords().concat(me.getUpdatedRecords()),
            len  = recs.length;

        for (i=0; i < len; i+=1) {
            rec = recs[i];
            rec.reject();
            if (rec.phantom) {
                me.remove(rec);
            }
        }


        recs = me.removed;
        len = recs.length;
        for (i = len-1; i >= 0; i-=1) {
            rec = recs[i];
            me.insert(rec.removedFrom || 0, rec);
            rec.reject();
        }

        me.removed.length = 0;
    }
});


