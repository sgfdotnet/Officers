var app = app || {};

$(function () {

    app.OfficerModel = Backbone.Model.extend({
        urlRoot: 'api/officers',
        defaults: {
            'firstName': '',
            'lastName': '',
        }
    });

    app.OfficerCollection = Backbone.Collection.extend({
        url: 'api/officers',
        model: app.OfficerModel
    });

    
    app.officers = new app.OfficerCollection();

    //app.officers.fetch({ reset: true });

    // Seed a test record
    app.officers.create({ firstName: 'David', lastName: 'Schlum', office: 'President' });

});