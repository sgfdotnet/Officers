var app = app || {};

$(function () {

    app.HeroView = Backbone.View.extend({
        el: '#content',
        template: _.template($('#hero').html()),
        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });

    app.OfficerForm = Backbone.View.extend({
        el: '#content',
        template: _.template($('#officer-form').html()),
        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });


    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'showHero',
            'officers/new': 'editOfficer',
            'officers/:id': 'displayOfficer',
            'officers/:id/edit': 'editOfficer'
        },
        showHero: function () {
            var hero = new app.HeroView();
            hero.render();
        },
        displayOfficer: function () {

        },
        editOfficer: function (id) {
            var form = new app.OfficerForm();
            form.render();
        }
    });

    app.appRouter = new AppRouter();
    Backbone.history.start();



});