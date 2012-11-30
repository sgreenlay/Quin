var app = app || {};

$(function($) {
    'use strict';

    app.MaxCountData = app.Data.extend({
        initialize: function(a) {
            if (a["field"]) {
                this.field = a["field"];
            } else {
                this.field = "friend_count";
            }
        },

        parse: function(res) {
            var counts, max, self;
            self = this;
            counts = _.sortBy(res.data, function(x) {
                return -x[self.field];

            }).slice(0,5);
            max = 0;
            counts = _.map(counts, function(x) {
                if (x[self.field] > max) {
                    max = x[self.field];
                }
                return {
                    type: x["name"],
                    value: x[self.field]
                };
            });
            this.set("data", counts);
            this.set("max", max);
        }
    });
});
