var app = app || {};

$(function($) {
    'use strict';

    app.Data = Backbone.Model.extend({
        initialize: function(a) {
            if (a["field"]) {
                this.field = a["field"];
            } else {
                this.field = "friend_count";
            }

            this.a = a;
        },

        setType: function(type) {
            this.URL = 'query?type=' + type
        },

        load: function() {
            var self = this;
            d3.json(this.URL, function(res) {
                self.parse(res);
                self.trigger("newData");
            });

        },

        extract: function(x) {
            var fields, i;
            fields = this.field.split(".");
            for (i = 0; i < fields.length; i++) {
                x = x[fields[i]];
                if (x == null) {
                    return null;
                }
            }
            return x;
        }
    });
});
