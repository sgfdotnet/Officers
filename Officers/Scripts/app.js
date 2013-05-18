var app = app || {};

$(function () {

    app.OfficerModel = Backbone.Model.extend({
        urlRoot: 'api/officers'
    });

    app.OfficerCollection = Backbone.Collection.extend({
        url: 'api/officers',
        model: app.OfficerModel
    });

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
        },
        events: {
            'click #save-button': 'save'
        },
        save: function () {
            var self = this;
            this.model.set({ 'firstName': $('#firstName').val(), 'lastName': $('#lastName').val() });
            this.model.save()
            .done(function () {
                console.log(self.model);
                app.officers.add(self.model);
                Backbone.history.navigate('officers/' + self.model.get('id'), true);
            });
        }
    });

    app.OfficerItemView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#officer-item-template').html()),
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    app.OfficerListView = Backbone.View.extend({
        el: '#officer-list',
        initialize: function () {
            this.listenTo(app.officers, 'add', this.addOne);
        },
        addOne: function (officer) {
            var itemView = new app.OfficerItemView({ model: officer });
            $('#officer-list').append(itemView.render().el);
        }
    });


    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'showHero',
            'officers/new': 'newOfficer',
            'officers/:id': 'displayOfficer',
            'officers/:id/edit': 'editOfficer'
        },
        showHero: function () {
            var hero = new app.HeroView();
            hero.render();
        },
        displayOfficer: function () {

            console.log('put display here');
        },
        newOfficer: function () {
            var form = new app.OfficerForm({ model: new app.OfficerModel() });
            form.render();
        },
        editOfficer: function (id) {
            var form = new app.OfficerForm();
            form.render();
        }
    });

    app.officers = new app.OfficerCollection();

    app.officerListView = new app.OfficerListView();
    app.officerListView.render();

    app.appRouter = new AppRouter();
    Backbone.history.start();

});