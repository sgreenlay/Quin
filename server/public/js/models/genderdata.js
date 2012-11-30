var app = app || {};

$(function($) {
    'use strict';

    app.GenderData = app.Data.extend({
        URL: 'query?type=gender',

        parse: function(res) {
            var counts, total;
            counts = _.pairs(_.countBy(res.data, function(x) {
                return x.sex ? x.sex : 'undeclared';
            }));
            counts = _.sortBy(counts, function(x) {
                return -x[1];
            });
            total = 0;
            counts = _.map(counts, function(x, i) {
                total += x[1];
                return {
                    type: x[0],
                    value: x[1],
                    sofar: (total - x[1])
                };
            });
            
            this.set("total", total);
            this.set("data", counts);
        }
    });
});
