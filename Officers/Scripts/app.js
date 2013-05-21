﻿var app = app || {};

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


    app.officers = new app.OfficerCollection();
    app.officers.fetch({ reset: true })
    .done(function () {

        app.views = {
            showHero: new app.HeroView(),
            officerListView: new app.OfficerListView({ collection: app.officers })
        };
       
        app.views.showHero.render();
        app.views.officerListView.render();
        app.views.officerListView.addAll();

    });

});