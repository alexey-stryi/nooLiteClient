Ext.define('nooControl.view.Settings', {
    extend: 'Ext.form.Panel',
    alias: 'widget.SettingsPanel',

    requires: [
        'Ext.TitleBar',
        'Ext.field.Url'
    ],

/*****************************************************************************/

    urlValidationRegexp : /(((^https?)|(^ftp)):\/\/((([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*)|(localhost|LOCALHOST))\/?)/i,

    config: {
        hideAnimation: {
            type      : 'slide',
            direction : 'right',
            out       : true
        },
        showAnimation:  {
            type      : 'slide',
            direction : 'left',
            out       : false
        },

        items : [{
            docked: 'top',
            xtype: 'titlebar',
            title: 'Settings',
            items: [{
                iconCls : 'arrow_left',
                itemId  : 'button_back',
                align   : 'left'
            }]
        },{
            xtype        : 'urlfield',
            name         : 'host',
            labelAlign   : 'top',
            label        : 'Remote host',
            placeHolder  : 'http://192.168.1.1',
            autoComplete : false
        },{
            xtype  : 'toolbar',
            docked : 'bottom',
            layout : {
                pack : 'center',
                type : 'hbox'
            },
            items : [{
                xtype   : 'button',
                itemId  : 'save_settings_button',
                iconCls : 'check2',
                ui      : 'plain'
            }]
        }]
    },

/*****************************************************************************/

    initialize : function() {
        var me = this;

        me.down('urlfield').on('keyup', me.onHostUrlChanged, me);
    },

/*****************************************************************************/

    onHostUrlChanged : function(fld) {
        var me = this;

        me.validateHostField();
    },

/*****************************************************************************/

    validateHostField : function() {
        var me    = this,
            fld   = me.down('urlfield'),
            value = fld.getValue();

        if (value.match(me.urlValidationRegexp)) {
            fld.removeCls('x-invalid');
            fld.valid = true;
        } else {
            fld.addCls('x-invalid');
            fld.valid = false;
        }
    }
});