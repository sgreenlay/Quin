var app = app || {};

$(function($) {
    'use strict';

    app.GroupByData = app.Data.extend({
        parse: function(res) {
            var counts, total, max, self;
            self = this;

            counts = _.pairs(_.countBy(res.data, function(x) {
                return self.extract(x) ? self.extract(x) : 'unknown';
            }));
            counts = _.sortBy(counts, function(x) {
                return -x[1];
            });

            // Reject unknowns?
            if (self.a && self.a["reject_unknowns"]) {
                counts = _.reject(counts, function(x) {
                    return x[0] == 'unknown';
                });
            }

            // Count initial totals
            total = 0;
            counts = _.map(counts, function(x, i) {
                total += x[1];
                return {
                    type: x[0],
                    value: x[1],
                    sofar: (total - x[1])
                };
            });

            // Reject outliers (< 1%)
            counts = _.reject(counts, function(x) {
                return x.value < total * .01;
            });

            // Gather stats
            total = _.inject(counts, function(s, x) {
                return s + x.value;
            }, 0);
            max = _.inject(counts, function(s, x) {
                return Math.max(s, x.value);
            }, 0);

            this.set("total", total);
            this.set("max", max);
            this.set("data", counts);
        }
    });
});
