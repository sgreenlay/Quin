var app = app || {};

$(function($) {
    'use strict';

    app.ChartView = Backbone.View.extend({
        setModel: function(model) {
            this.model = model;
            this.model.on("newData", this.dataChanged, this);
        },

        dataChanged: function() {
            this.render(this.model);
        }
    });
});
