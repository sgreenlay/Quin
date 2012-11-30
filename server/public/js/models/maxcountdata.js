var app = app || {};

$(function($) {
    'use strict';

    app.MaxCountData = app.Data.extend({
        parse: function(res) {
            var counts, max, self;
            self = this;
            counts = _.sortBy(res.data, function(x) {
                return -self.extract(x);

            }).slice(0,5);
            max = 0;
            counts = _.map(counts, function(x) {
                if (self.extract(x) > max) {
                    max = self.extract(x);
                }
                return {
                    type: x["name"],
                    value: self.extract(x)
                };
            });
            this.set("data", counts);
            this.set("max", max);
        }
    });
});
