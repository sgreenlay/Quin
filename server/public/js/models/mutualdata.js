var app = app || {};

$(function($) {
    'use strict';

    app.MutualData = app.Data.extend({
        URL: 'query?type=mutuals',

        parse: function(res) {
            var counts, max;
            counts = _.sortBy(res.data, function(x) {
                return -x.mutual_friend_count;
            }).slice(0,5);
            max = 0;
            counts = _.map(counts, function(x) {
                if (x["mutual_friend_count"] > max) {
                    max = x["mutual_friend_count"];
                }
                return {
                    type: x["name"],
                    value: x["mutual_friend_count"]
                };
            });
            this.set("data", counts);
            this.set("max", max);
        }
    });
});
