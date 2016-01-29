Ext.define('nooControl.model.Bulb', {
    extend : 'Ext.data.Model',

    config : {
        fields : [
            {name: 'id',       type: 'string'},
            {name: 'name',     type: 'string',  defaultValue: 'Bulb'},
            {name: 'location', type: 'string',  defaultValue: 'Some location'},
            {name: 'state',    type: 'string',  defaultValue: 'off'},
            {name: 'binded',   type: 'boolean', defaultValue: false},
            {name: 'type',     type: 'string',  defaultValue: 'switch'},
            {name: 'color',    type: 'string',  defaultValue: '#FFFFFF'},
            {name: 'brightness', type: 'int',   defaultValue: 100},
            {name: 'channel',    type: 'int'}
        ],

        belongsTo : [
            {model: 'nooControl.model.Location'}
        ],

        validations: [
            {type: 'presence',  field: 'name'},
            {type: 'length',    field: 'name',     min: 2},
            {type: 'inclusion', field: 'state',   list: ['on', 'off']},
            {type: 'inclusion', field: 'type',    list: ['switch', 'button', 'dimmer', 'led']},
            {type: 'format',    field: 'color',   matcher: /^#?[0-9A-F]{6}$/i}
        ]
    }
});
