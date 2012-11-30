var app = app || {};

$(function($) {
    var view, model;
    model = new app.GenderData();
    view = new app.AppView({
        dataModel: model
    });

    model.load('/query');
});
