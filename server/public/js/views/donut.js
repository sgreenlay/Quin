var app = app || {};

$(function($) {
    'use strict';

    var WIDTH = 300;
    var HEIGHT = 300;
    var INNER_RAD = 65;
    var OUTER_RAD = WIDTH/2;

    var COLOR_MAP = {
        male: 'CornflowerBlue',
        female: 'Crimson',
        unknown: 'White'
    };

    var BACKUP_COLORS = [
        'Tomato',
        'CornflowerBlue',
        'Crimson',
        'PaleGreen'
    ];

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
            var arc, data, total, legends;

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
                .style("fill", function(d, i) {
                    if (COLOR_MAP[d.type]) {
                        return COLOR_MAP[d.type];
                    }
                    return BACKUP_COLORS[i % BACKUP_COLORS.length];
                });

            var legends = d3.select("#legend").selectAll("div.legend")
                .data(data)
                .enter().append("div")
                .attr("class", "legend clearfix");
            legends.append("div")
                .attr("class", "box")
                .style("background-color", function(d, i) {
                    if (COLOR_MAP[d.type]) {
                        return COLOR_MAP[d.type];
                    }
                    return BACKUP_COLORS[i % BACKUP_COLORS.length];
                });
            legends.append("div")
                .attr("class", "label")
                .text(function(d) {
                    var perc;
                    perc = d.value / total;
                    perc = Math.floor(perc * 100);
                    return d.type + " (" + perc + "%)";
                });
        }
    });
});
