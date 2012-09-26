/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> \n' +
              ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
              ' * <%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>\n' +
              ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
              ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n'+
              ' */'
    },

    lint: {
      files: ['grunt.js', '_dev/js/*.js']
    },
    
    // CONCATENATE
    concat: {
      // JS FILES
      js: {
        src: [
          '<banner:meta.banner>', // Adds banner
          '_dev/js/lib.js',
          '_dev/js/board.js',
          '_dev/js/block.js',
          '_dev/js/puzzle.js',
          '_dev/js/dragdrop.js',
          '_dev/js/game.js'
        ],
        dest: '_static/js/<%= pkg.name %>.js'
      },
      // CSS FILES
      css: {
        src: [
          '<banner:meta.banner>', // Adds banner
          '_dev/css/reset.css',
          '_dev/css/board.css',
          '_dev/css/block.css',
          '_dev/css/game.css'
        ],
        dest: '_static/css/<%= pkg.name %>.css'
      }
    },
    
    // JS MIN
    min: {
      dist: {
        // Use banner and concatenated JS file
        src: ['<banner:meta.banner>', '<config:concat.js.dest>'],
        dest: '_static/js/<%= pkg.name %>.min.js'
      }
    },

    // CSS MIN
    cssmin: {
      dist: {
        // Use banner and concatenated CSS file
        src: ['<banner:meta.banner>', '<config:concat.css.dest>'],
        dest: '_static/css/<%= pkg.name %>.min.css'
      }
    },
    
    /*watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },*/
    
    // JSHINT SETTINGS
    jshint: {
      options: {
        browser: true,
        devel: true, // console, alert
        smarttabs: true,
        laxbreak: true,
        laxcomma: true,
        scripturl: true
      },
      globals: {
        jQuery: true,
        $: true
      }
    },
    
    // UGLIFY SETTINGS
    uglify: {
    },

   /* recess: {
      dist: {
        src: [
          '_dev/css/reset.css',
          '_dev/css/board.css',
          '_dev/css/block.css',
          '_dev/css/game.css'
        ],
        dest: '_static/css/<%= pkg.name %>.min.css',
        options: {
          compress: true
        }
      }
    },*/

    // SMUSH IMAGES
    smushit: {
      destination:{
          src:'_dev/img',
          dest:'_static/img'
      }
    }


  });

  // RECESS - css minification
  // https://github.com/sindresorhus/grunt-recess#readme
  // kinda crappy
  //grunt.loadNpmTasks('grunt-recess');

  // https://github.com/jzaefferer/grunt-css
  grunt.loadNpmTasks('grunt-css');

  // Node Smushit
  // https://github.com/heldr/grunt-smushit
  grunt.loadNpmTasks('grunt-smushit');

  // Default task.
  grunt.registerTask('default', 'concat min cssmin');

  // Release taks (default + smush img)
  grunt.registerTask('release', 'concat min cssmin smushit');

};
