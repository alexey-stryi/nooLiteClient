Ext.define('nooControl.model.Bulb', {
    extend : 'Ext.data.Model',

    config : {
        fields : [
            {name: 'id',       type: 'string'},
            {name: 'name',     type: 'string',  defaultValue: ''},
            {name: 'location', type: 'string',  defaultValue: ''},
            {name: 'state',    type: 'string',  defaultValue: 'off'},
            {name: 'type',     type: 'string',  defaultValue: 'switch'},
            {name: 'color',    type: 'string',  defaultValue: '#FFFFFF'},
            {name: 'brightness', type: 'int',   defaultValue: 100},
            {name: 'binded',     type: 'object',  persist: false},
            {name: 'channels',   type: 'object',  persist: false}
        ],

        belongsTo : [
            {model: 'nooControl.model.Location'}
        ],

        validations: [
            {type: 'presence',  field: 'name'},
            {type: 'length',    field: 'name',  min: 2},
            {type: 'inclusion', field: 'state', list: ['on', 'off']},
            {type: 'inclusion', field: 'type',  list: ['switch', 'button', 'dimmer', 'led']},
            {type: 'format',    field: 'color', matcher: /^#?[0-9A-F]{6}$/i}
        ]
    },

/*****************************************************************************/

    isBinded : function() {
        var me       = this, result = false,
            binded   = me.get('binded'),
            channels = me.get('channels');

        if (binded === 1) {
            return true;
        }

        Ext.Array.each(channels, function(ch) {
            result = result || (binded[ch] > 0);
        });

        return result;
    }
});
