/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %> \n' +
              ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
              ' * <%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>\n' +
              ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
              ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n'+
              ' */'
    },

    jshint: {
        options: {
          browser: true,
          devel: true, // console, alert
          smarttabs: true, // This option suppresses warnings about mixed tabs and spaces when the latter are used for alignmnent only. 
          scripturl: true, // This option suppresses warnings about the use of script-targeted URLs—such as javascript:;
          expr: true, // Suppresses warnings about the use of expressions where normally you would expect to see assignments or function calls
          globals: {
            $: true
          }
        },
        files: ['Gruntfile.js', '_dev/js/*.js']
    },
    
    // CONCATENATE
    // https://npmjs.org/package/grunt-contrib-concat
    concat: {
      js: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        src: [
            '_dev/js/lib.js',
            '_dev/js/audiosprite.js',
            '_dev/js/board.js',
            '_dev/js/block.js',
            '_dev/js/puzzle.js',
            '_dev/js/block.move.js',
            '_dev/js/game.js',
            '_dev/js/ui.js'
          ],
        dest: 'public/assets/js/<%= pkg.name %>.js'
      },
      css: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
        },
        src: [
            '_dev/css/reset.css',
            '_dev/css/base.css',
            '_dev/css/board.css',
            '_dev/css/block.css',
            '_dev/css/ui.css'
        ],
        dest: 'public/assets/css/<%= pkg.name %>.css'
      }
    },
    
    // JS MIN
    uglify: {
      dist: {
        // Use banner and concatenated JS file
        src: 'public/assets/js/<%= pkg.name %>.js',
        dest: 'public/assets/js/<%= pkg.name %>.min.js'
      }
    },

    // CSS MIN
    // https://npmjs.org/package/grunt-contrib-cssmin
    cssmin: {
      compress: {
        files: {
          'public/assets/css/<%= pkg.name %>.min.css': ['public/assets/css/<%= pkg.name %>.css']
        }
      }
    },

    // Grunt Smushit
    // https://github.com/heldr/grunt-smushit
    smushit:{
      destination:{
          src: '_dev/img',
          dest: 'public/assets/img'
      }
    },

    // Copy HTML to public dir
    copy: {
      html: {
        files: [{
          src: '_dev/index.html',
          dest: 'public/index.html'
        }]
      },
      audio: {
        files: [{
          flatten: true,
          expand: true,
          src: '_dev/audio/*',
          dest: 'public/assets/audio/'
        }]
      }
    },

    // Changes path to assets
    usemin: {
      html: ['public/index.html']
    },

    // Minifies HTML
    htmlmin: {
      public: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true
        },
        files: {
          'public/index.html': 'public/index.html'
        }
      }
    },
    
    // WATCH
    // https://npmjs.org/package/grunt-contrib-watch
    watch: {
      files: '_dev/*',
      tasks: ['default']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-smushit');
  grunt.loadNpmTasks('grunt-usemin');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);

  // Release taks (Default task  + Smushit + minify HTML)
  grunt.registerTask('release', ['jshint', 'concat', 'uglify', 'cssmin', 'copy:html', 'usemin:html', 'htmlmin', 'smushit', 'copy:audio']);

  // Deploy (Release task + versioning + ftp deploy)
  grunt.registerTask('deploy', ['jshint' ,'concat', 'uglify', 'cssmin', 'htmlmin', 'smushit', '']);

};
