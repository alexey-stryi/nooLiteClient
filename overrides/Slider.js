Ext.define('overrides.Slider', {
    override : 'Ext.slider.Slider',

    onTap : function() {
        var sliderEl, sliderField;

        this.callParent(arguments);

        sliderEl = this.element.up('div.x-field.x-slider-field');

        if (sliderEl) {
            sliderField = Ext.getCmp(sliderEl.id);

            if (sliderField) {
                sliderField.fireEvent('tap', sliderField);
            }
        }
    }
});

