var app = app || {};

$(function($) {
    'use strict';

    app.Data = Backbone.Model.extend({
        load: function() {
            var self = this;
            d3.json(this.URL, function(res) {
                self.parse(res);
                self.trigger("newData");
            });

        }
    });
});
