var app = app || {};

$(function($) {
    'use strict';

    var WIDTH = 200;
    var HEIGHT = 200;
    var INNER_RAD = 45;
    var OUTER_RAD = WIDTH/2;

    var COLOR_MAP = {
        male: 'CornflowerBlue',
        female: 'Crimson'
    };

    app.DonutView = app.ChartView.extend({
        initialize: function(a) {
            this.el = d3.select("#chart")
                .append("svg")
                .attr("width", WIDTH)
                .attr("height", HEIGHT);

            this.chart = this.el.append("g")
                .attr("transform", "translate(" +
                      WIDTH/2 + "," +
                      HEIGHT/2 + ")");
        },

        render: function(model) {
            var arc, data, total;

            data = model.get("data");
            total = model.get("total");

            arc = d3.svg.arc()
                .innerRadius(INNER_RAD)
                .outerRadius(OUTER_RAD)
                .startAngle(function(d) {
                    return (2 * Math.PI) * d.sofar / total;
                })
                .endAngle(function(d) {
                    return (2 * Math.PI) * (d.sofar + d.value) / total;
                });

            this.chart.selectAll("path")
                .data(data)
                .enter().append("path")
                .attr("d", arc)
                .style("fill", function(d) {
                    if (COLOR_MAP[d.type]) {
                        return COLOR_MAP[d.type];
                    }
                    return "black";
                })
;
        }
    });
});
