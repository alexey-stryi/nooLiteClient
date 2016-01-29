Ext.define('overrides.SliderToggle', {
    override : 'Ext.slider.Toggle',

    onTap : function() {
        var toggleEl, toggleField;

        this.callParent(arguments);

        toggleEl = this.element.up('div.x-field.x-toggle-field');

        if (toggleEl) {
            toggleField = Ext.getCmp(toggleEl.id);

            if (toggleField) {
                toggleField.fireEvent('tap', toggleField);
            }
        }
    }
});

