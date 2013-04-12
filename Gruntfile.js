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

    // JSHINT
    // https://npmjs.org/package/grunt-contrib-jshint
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
        dest: 'public/assets/css/<%= pkg.name %>-<%= pkg.version %>.css'
      }
    },
    
    // JS MIN
    // https://npmjs.org/package/grunt-contrib-uglify
    uglify: {
      dist: {
        // Use banner and concatenated JS file
        src: 'public/assets/js/<%= pkg.name %>.js',
        dest: 'public/assets/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },

    // CSS MIN
    // https://npmjs.org/package/grunt-contrib-cssmin
    cssmin: {
      compress: {
        files: {
          'public/assets/css/<%= pkg.name %>-<%= pkg.version %>.min.css': ['public/assets/css/<%= pkg.name %>-<%= pkg.version %>.css']
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

    // COPY
    // https://npmjs.org/package/grunt-contrib-copy
    copy: {

      // Copy HTML file to public directory
      //   - replace version tag and path of inline images
      //   - add manifest attribute to <html> tag
      html: {
        options: {
          processContent: function (content, srcpath) {
            var pkg = grunt.config('pkg');
            var ver = grunt.template.process("<%= pkg.version %>", pkg );

            return content.replace(/{{version}}/g , ver ).replace(/\/_dev\/img\//g, 'assets/img/').replace(/<html>/, '<html manifest="manifest.appcache">');
          } 
        },
        files: [{
          src: '_dev/index.html',
          dest: 'public/index.html'
        }]
      },

      // Copy audio files in public directory
      audio: {
        files: [{
          flatten: true,
          expand: true,
          src: '_dev/audio/*',
          dest: 'public/assets/audio/'
        }]
      },

      // Copy chrome manifest and populate with data from package.json
      manifest: {
        options: {
          processContent: function (content, srcpath) {
            
            var data = JSON.parse( content );
            var pkg = grunt.config('pkg');
            
            data.name = grunt.template.process("<%= pkg.title %>", pkg );
            data.description = grunt.template.process("<%= pkg.description %>", pkg );
            data.version = grunt.template.process("<%= pkg.version %>", pkg );
            
            data.app = {};
            data.app.launch = {};

            data.app.launch.web_url = grunt.template.process("<%= pkg.homepage %>", pkg );
            data.app.urls = [ grunt.template.process("<%= pkg.domain %>", pkg ) ];

            return JSON.stringify( data );
          }
        },
        files: [
          {
            src: '_dev/chrome-manifest.json',
            dest: 'stores/chrome/manifest.json'
          }
        ]
      }
    },

    // USEMIN
    // https://npmjs.org/package/grunt-usemin
    usemin: {
      html: ['public/index.html']
    },

    // Minify HTML
    // https://npmjs.org/package/grunt-contrib-htmlmin
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

    // COMPRESS
    // https://npmjs.org/package/grunt-contrib-compress
    compress: {
      chromestore: {
        options: {
          archive: 'stores/chrome.zip',
          mode: 'zip'
        },
        expand: true,
        cwd: 'stores/',
        src: ['chrome/**'],
        dest: '/'
      }
    },

    // BUMPX
    // https://npmjs.org/package/grunt-bumpx
    bump: {
      options: {
        part: 'patch'
      },
      // Bump version in package.json
      files: [ 'package.json' ]
    },

    // MANIFEST
    // https://npmjs.org/package/grunt-manifest
    manifest: {
      generate: {
        options: {
          basePath: 'public/',
          network: [
            '*',
            'http://*',
            'https://*'
          ],
          verbose: false,
          timestamp: true
        },
        src: [
          'index.html',
          'assets/js/*.min.js',
          'assets/css/*.min.css',
          'assets/img/sprite.png'
        ],
        dest: 'public/manifest.appcache'
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
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-manifest');
  grunt.loadNpmTasks('grunt-smushit');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-bumpx');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);

  // Release taks (Default task + Smushit + minify HTML + copy files)
  grunt.registerTask('release', ['jshint', 'concat', 'uglify', 'cssmin', 'copy:html', 'usemin:html', 'htmlmin', 'smushit', 'copy:audio', 'manifest']);

  // Build manifest for chrome store
  grunt.registerTask('chromestore', ['bump', 'copy:manifest', 'compress:chromestore']);

};
