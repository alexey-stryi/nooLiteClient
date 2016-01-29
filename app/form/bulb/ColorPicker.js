Ext.define('nooControl.form.bulb.ColorPicker', {
    extend : 'Ext.Panel',

    alias: 'widget.ColorPicker',

/*****************************************************************************/

    config : {
        modal         : true,
        hideOnMaskTap : true,
        cls           : 'x-color-picker',

        showAnimation : {
            type     : 'popIn',
            duration : 250,
            easing   : 'ease-out'
        },
        hideAnimation : {
            type     : 'popOut',
            duration : 250,
            easing   : 'ease-out'
        },
        centered : true,
        styleHtmlContent : true,

        height : 300,
        widht  : 300,

        html  : '<span class="color-value-text"></span><div class="color-wheel-container"><div class="color-wheel"></div></div>',

        items : [{
            docked : 'top',
            xtype  : 'toolbar',
            title  : 'Pick a color',
            items  : [{
                iconCls : 'delete',
                itemId : 'cancel_color_pick'
            }, {
                xtype : 'spacer'
            },{
                iconCls : 'check2',
                itemId  : 'done_color_pick'
            }]
        },{
            docked   : 'bottom',
            xtype    : 'container',
            margin   : 5,
            layout   : { pack : 'center', type: 'hbox' },
            defaults : {flex: 1, xtype  : 'container', layout : { pack : 'center', type: 'hbox' }},
            items    : [{
                items  : {
                    xtype  : 'button',
                    itemId : 'warm_white_color_button',
                    text   : '100W'
                }
            },{
                items  : {
                    xtype  : 'button',
                    itemId : 'halogen_white_color_button',
                    text   : 'Halogen'
                }
            },{
                items  : {
                    xtype  : 'button',
                    itemId : 'white_color_button',
                    text   : 'White'
                }
            }]
        }],
        scrollable: false
    },

/*****************************************************************************/

    initialize : function() {
        var me = this,
            renderTo = me.element.down('div.color-wheel');

        me.setWidth(me.getPickerWidth());
        me.setHeight(me.getPickerHeight());

        me.colorWheel = new HueWheel(renderTo, {
            onChange             : function() {
                                       me.onColorWheelChanged.apply(me, arguments);
                                   },

            diameter             : me.getWheelDiameter(),
            shadowBlur           : 7,
            thicknessHue         : 35,
            thicknessLightness   : 15,

            lightness            : 0.5,

            changeSaturation     : false,

            showColor            : true,
            colorSpotWidth       : 0.5,
            colorSpotBorder      : 1,
            colorSpotBorderColor : '#333',
            quality              : 2,

            hueKnobSize          : 0.14,
            hueKnobColor         : '#ffc',
            hueKnobColorSelected : '#fff',
            hueKnobShadow        : true,

            useKeys              : true,
            hueKeyDelta          : 2,
            saturationKeyDelta   : 1,
            shiftKeyFactor       : 10
        });

        if (me.color) {
            me.setColor(me.color);
            delete me.color;
        }
    },

/*****************************************************************************/

    destroy : function() {
        var me = this;

        Ext.destroy(me.colorWheel);
        me.callParent(arguments);
    },

/*****************************************************************************/

    setRecord : function(record) {
        var me = this;

        me.callParent(arguments);
        me.setColor(record.get('color'));
    },

/*****************************************************************************/

    onColorWheelChanged : function(e){
        var me = this;

         me._rgb = [e.r, e.g, e.b];

         me.element.down('span.color-value-text').setHtml(Ext.String.format('R:{0} G:{1} B:{2}', e.r, e.g, e.b));
    },

/*****************************************************************************/

    setColor : function(color) {
        var me  = this, hsl,
            rgb = me._hexToRgb(color),
            cw  = me.colorWheel;

        if (!cw) {
            return;
        }

        color = color.replace(/[^0-9A-F]/gi, '').toLowerCase();

        switch (color) {
            case 'ffffff' :             // white
                hsl = cw.rgb2hsl(255,255,255);
                hsl.s = 1;
                break;
            case 'ffd6aa' :             // warm white
                hsl = cw.rgb2hsl(255,214,170);
                break;
            case 'fff1e0':              // halogen
                hsl = cw.rgb2hsl(255,241,224);
                break;
            default :
                hsl = cw.rgb2hsl.apply(cw, rgb);
                hsl.l = 0.5;    // keep lightness at the same level
        }

        cw.hsl(hsl.h, hsl.s, hsl.l);
    },

/*****************************************************************************/

    getColor : function() {
        var me = this;

        if (me._rgb) {
            return me._rgbToHex(me._rgb);
        }
    },

/*****************************************************************************/

    _hexToRgb : function(hex) {
        var bigint = parseInt(hex.replace(/[^0-9A-F]/gi, ''), 16);

        return [
            (bigint >> 16) & 255,
            (bigint >> 8) & 255,
            (bigint & 255)
        ];
    },

/*****************************************************************************/

    _rgbToHex : function(rgb) {
        return ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).substr(1);
    },

/*****************************************************************************/

    getPickerWidth : function() {
        if (Ext.filterPlatform('ie10')) {
            return Ext.Viewport.windowWidth;
        }

        if (Ext.os.deviceType !== 'Phone') {
            return 400;
        }

        return Ext.Viewport.windowWidth * 0.9;
    },

/*****************************************************************************/

    getPickerHeight : function() {
        if (Ext.filterPlatform('ie10')) {
            return Ext.Viewport.windowWidth * 0.3;
        }

        if (Ext.os.deviceType !== 'Phone' || Ext.Viewport.getOrientation() === 'portrait') {
            return 430;
        }

        return Ext.Viewport.windowHeight;
    },

/*****************************************************************************/

    getWheelDiameter : function() {
        var me = this;
        
        if (Ext.os.deviceType === 'Phone') {
            return  (Ext.Viewport.getOrientation() === 'portrait') ? me.getWidth() - 30 : 230;
        }
        return 300;
    }

});