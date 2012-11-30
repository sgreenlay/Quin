var app = app || {};

$(function($) {
    'use strict';

    app.CountData = app.Data.extend({
        parse: function(res) {
            var counts, max, total, self;
            self = this;
            counts = _.sortBy(res.data, function(x) {
                return -self.extract(x);

            })

            // Slice results?
            if (self.a && self.a["slice_to"]) {
                counts = counts.slice(0, self.a["slice_to"]);
            }
         
            // Format
            counts = _.map(counts, function(x) {
                return {
                    type: x["name"],
                    value: self.extract(x)
                };
            });

            // Gather stats
            total = _.inject(counts, function(s, x) {
                return s + x.value;
            }, 0);
            max = _.inject(counts, function(s, x) {
                return Math.max(s, x.value);
            }, 0);

            this.set("data", counts);
            this.set("max", max);
            this.set("total", total);
        }
    });
});
