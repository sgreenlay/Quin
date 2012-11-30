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
            this.queryType = type
        },
        
        setQuery: function(query) {
            this.queryText = query
        },
        
        getURL: function() {
            return 'query?type=' + this.queryType + '&text=' + this.queryText;
        },

        load: function() {
            var self = this;
            d3.json(self.getURL(), function(res) {
                self.parse(res);
                self.trigger("newData");
            });
        },

        parse: function(res) {
            this.set("data", res.data);
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
