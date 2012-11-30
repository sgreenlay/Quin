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
    
    var query = getQueryVariable("query");
    var token = getQueryVariable("token");

    function capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    d3.json(TYPE_URL + "?query=" + query, function(res) {
        switch(res) {
            case 'current_loc':
                model = new app.Data({field: "", reject_unknowns:true});
                chart = new app.FacepileView();
                break;
            case 'languages':
                model = new app.GroupByData({field: "languages.name"});
                chart = new app.DonutView();
                break;
            case 'relationship':
                model = new app.GroupByData({field: "relationship_status", reject_unknowns:true});
                chart = new app.DonutView();
                break;
            case 'gender':
                model = new app.GroupByData({field: "sex"});
                chart = new app.DonutView();
                break;
            case 'mutual':
                model = new app.CountData({field: "mutual_friend_count", slice_to:5});
                chart = new app.BarView();
                break;
            case 'friends':
                model = new app.CountData({field: "friend_count", slice_to: 5});
                chart = new app.BarView();
                break;
            case 'single':
                model = new app.Data({field: "", reject_unknowns:true});
                chart = new app.FacepileView();
                break;
        }

        if (chart != null && model != null) {
            model.setType(res);
            model.setQuery(query);
            model.setToken(token);
            chart.setModel(model);
            model.load();

            model.on('newData', function() {
                // This will be cancelled by obj-c
                var is_uiwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
                if (is_uiwebview) {
                    window.location.href = "js-call:layoutWebview";
                }
            });
        }
    });

    d3.select("#query").text(capitalizeFirst(getQueryVariable("query")));
});
