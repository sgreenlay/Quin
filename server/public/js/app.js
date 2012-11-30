var app = app || {};

$(function($) {
    var view, chart;
    model = new app.MutualData();
    chart = new app.BarView({
        dataModel: model
    });
    model.load();
});
