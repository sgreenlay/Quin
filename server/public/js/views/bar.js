var app = app || {};

$(function($) {
    'use strict';

    var WIDTH = 200;
    var HEIGHT = 200;
    var BAR_MIN_WIDTH = 10;
    var COLOR

    app.BarView = Backbone.View.extend({
        initialize: function(a) {
            if (!a["dataModel"]) {
                throw "No data model specified";
            }

            this.model = a["dataModel"];
            this.model.on("newData", this.dataChanged, this);

            this.el = d3.select("#chart")
                .append("svg")
                .attr("width", WIDTH)
                .attr("height", HEIGHT);

            this.chart = this.el.append("g");
        },

        dataChanged: function() {
            this.render(this.model);
        },

        render: function(model) {
            var data, x, h, w, counts, value, label, barsD, barsL;

            data = model.get("data");
            value = function(d) { return d.value; }
            label = function(d) { return d.type; }

            x = d3.scale
                .linear()
                .domain([0, this.model.get("max")])
                .range([BAR_MIN_WIDTH, (WIDTH - 25)]);

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
                    (Math.min(value(d) * 4, 100) + 150) + 
                ")";
            })
            .style("stroke", "white")
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
