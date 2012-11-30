var app = app || {};

$(function($) {
    'use strict';

    var TYPE_URL = "typeify";
    var view, chart, model;
    chart = model = null;

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    }

    d3.json(TYPE_URL + "?query=" + getQueryVariable("query"), function(res) {
        switch(res) {
        case 'gender':
            model = new app.GenderData();
            chart = new app.DonutView();
            break;
        case 'mutuals':
            model = new app.MaxCountData({field: "mutual_friend_count"});
            chart = new app.BarView();
            break;
        case 'friends':
            model = new app.MaxCountData({field: "friend_count"});
            chart = new app.BarView();
            break;
        }

        if (chart != null && model != null) {
            model.setType(res);
            chart.setModel(model);
            model.load();
        }
    });
});
