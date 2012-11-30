var app = app || {};

$(function($) {
    'use strict';

    var WIDTH = 250;
    var HEIGHT = 200;
    var BAR_MIN_WIDTH = 10;
    var TEXT_WIDTH = 35;
    var BG_COLOR = "#1e1e1e";

    app.BarView = app.ChartView.extend({
        initialize: function(a) {
            this.el = d3.select("#chart")
                .append("svg")
                .attr("width", WIDTH)
                .attr("height", HEIGHT);

            this.chart = this.el.append("g");
        },

        render: function(model) {
            var data, x, h, w, value, label, barsD, barsL, color;
            data = model.get("data");
            value = function(d) { return d.value; }
            label = function(d) { return d.type; }

            if (!data.length) {
                throw "No data supplied to chart";
            }

            x = d3.scale
                .linear()
                .domain([0, this.model.get("max")])
                .range([BAR_MIN_WIDTH, (WIDTH - TEXT_WIDTH)]);

            color = d3.scale
                .linear()
                .domain([data[data.length-1].value, this.model.get("max")])
                .range([0, 25]);

            barsD = this.chart.selectAll("rect")
                .data(data);
            barsD.enter().append("rect");
            barsD.exit().remove();
            barsD.attr("width", function(d) {
                return x(value(d)) + "px";
            })
            .attr("y", function(d, i) {
                return i * HEIGHT/5;
            })
            .attr("height", HEIGHT/5)
            .style("fill", function(d) {
                return "rgb(70, 130, " + 
                    (Math.floor(color(value(d))) + 200) +
                ")";
            })
            .style("stroke", BG_COLOR)
            .style("stroke-width", "4px");

            barsL = this.chart.selectAll("text.label")
                .data(data);
            barsL.enter().append("text")
                .attr("class", "label")
                .attr("fill", "white")
                .attr("font-weight", "600")
                .attr("font-family", "helvetica")
                .attr("font-size", "12px")
                .text(function(d) {
                    return label(d);
                })
                .attr("y", function(d, i) {
                    return (i + 0.6) * HEIGHT/5;
                })
                .attr("x", 5);
            barsL.exit().remove();

            barsL = this.chart.selectAll("text.count")
                .data(data);
            barsL.enter().append("text")
                .attr("class", "count")
                .attr("fill", "white")
                .attr("font-weight", "bold")
                .attr("font-family", "helvetica")
                .attr("font-size", "14px")
                .text(function(d) {
                    return value(d);
                })
                .attr("y", function(d, i) {
                    return (i + 0.6) * HEIGHT/5;
                })
                .attr("x", function(d) {
                    return x(value(d) + 2) + "px";
                });
            barsL.exit().remove();
        }
    });
});
