var elixir = require('laravel-elixir');
require('./tasks/angular.task.js');
require('./tasks/bower.task.js');
require('laravel-elixir-livereload');

elixir(function(mix){
    mix
        .bower('vendor.js', './public/js', 'vendor.css', './public/css')
        .angular('./resources/assets/js/', './public/js')
        .less('./resources/assets/js/**/*.less', 'public/css')
        .copy('./resources/assets/js/partials/*.html', 'public/views/app/')
        .copy('./resources/assets/js/app/directives/**/*.html', 'public/views/directives/')
        //.copy('./resources/assets/js/dialogs/**/*.html', 'public/views/dialogs/')
        .livereload([
            'public/js/vendor.js',
            'public/js/app.js',
            'public/css/vendor.css',
            'public/css/app.css',
            'public/views/**/*.html'
        ], {liveCSS: true});
});
