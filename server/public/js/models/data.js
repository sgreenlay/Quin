var app = app || {};

$(function($) {
    'use strict';

    app.Data = Backbone.Model.extend({
        load: function(url) {
            var self = this;
            d3.json(url, function(res) {
                self.parse(res);
                self.trigger("newData");
            });

        }
    });
});
