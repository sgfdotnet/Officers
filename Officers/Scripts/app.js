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

    app.HeroView = Backbone.View.extend({
        el: '#content',
        template: _.template($('#hero').html()),
        render: function () {
            this.$el.html(this.template());
            return this;
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
            this.listenTo(app.officers, 'reset', this.addAll);
        },
        addOne: function (officer) {
            var itemView = new app.OfficerItemView({ model: officer });
            $('#officer-list').append(itemView.render().el);
        },
        addAll: function () {
            $('#officer-list').html('');
            app.officers.each(this.addOne, this);
        }
    });

    app.OfficerDetailsView = Backbone.View.extend({
        el: '#content',
        template: _.template($('#officer-detail').html()),
        render: function (options) {
            this.model = options.model;
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        events: {
            'click #edit-button': 'editMe',
            'click #impeach-button': 'impeach'
        },
        editMe: function () {
            Backbone.history.navigate('#officers/' + this.model.get('id') + '/edit', true);
        },
        impeach: function () {
            var resp = confirm('Are you sure you want to impeach ' + this.model.get('firstName') + '?');
            if (resp) {
                this.model.destroy()
                .done(function () {
                    Backbone.history.navigate('#', true);
                });
            }
        }
    });

    app.OfficerForm = Backbone.View.extend({
        el: '#content',
        template: _.template($('#officer-form').html()),
        render: function (options) {
            this.model = options.model;
            if (options.mode) {
                this.model.set('mode', options.mode);
            }
            this.$el.html(this.template(this.model.toJSON()));

            if (options.mode === 'edit') {
                $('#office').val(this.model.get('office'));
                $('#elect-button').html('Re-elect');
            }
            return this;
        },
        events: {
            'click #elect-button': 'elect',
        },
        elect: function (e) {
            var self = this;
            this.model.set({ 'firstName': $('#firstName').val(), 'lastName': $('#lastName').val(), 'office': $('#office').val() });
            this.model.save()
            .done(function () {
                app.officers.add(self.model);
                Backbone.history.navigate('#officers/' + self.model.get('id'), true);
                self.stopListening();
            });
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
            app.views.hero.render();
        },
        displayOfficer: function (id) {
            var officer = app.officers.get(id);
            app.views.officerDetails.render({ model: officer });
        },
        newOfficer: function () {
            app.views.officerForm.render({ mode: 'new', model: new app.OfficerModel() });
        },
        editOfficer: function (id) {
            var officer = app.officers.get(id);
            app.views.officerForm.render({ mode: 'edit', model: officer });
        }
    });


    app.officers = new app.OfficerCollection();
    app.officers.fetch({ reset: true })
    .done(function () {

        app.views = {
            hero: new app.HeroView(),
            officerListView: new app.OfficerListView({ collection: app.officers }),
            officerDetails: new app.OfficerDetailsView(),
            officerForm: new app.OfficerForm()
        };
       
        app.views.hero.render();
        app.views.officerListView.render();
        app.views.officerListView.addAll();

        app.appRouter = new AppRouter();
        Backbone.history.start();

    });

});