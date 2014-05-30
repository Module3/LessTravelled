// Gruntfile.js

'use strict';

process.env.PHANTOMJS_EXECUTABLE = process.env.PHANTOMJS_EXECUTABLE || 'usr/local/opt/nvm/v0.10.28/bin/phantomjs';


module.exports = function(grunt){

  
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['Gruntfile.js', 'server.js', './test/front-end/acceptance/*.js', 'test/front-end/unit/*.js', 'app/js/**/*.js']
    },
    clean: ['dist'],
    copy: {
      all:{
        expand: true,
        cwd: 'app/',
        src: ['css/*', '*.html', 'img/**/*', '!Gruntfile.js'],
        dest: 'dist/',
        flatten: true,
        filter: 'isFile'
      }
    },
    browserify: {
      all: {
        src: 'app/js/**/*.js',
        dest: 'dist/client.js'
      },
      options: {
        transform: ['debowerify', 'hbsfy'],
        debug: true
      },
      test: {
        src: ['test/front-end/unit/**/*.js'],
        dest: 'test/front-end/test-suite.js'
      }
    },
    simplemocha : {
      all : 'test/front-end/test-suite.js'
    },
    express: {
      dev: {
        options: {
          script: 'server.js'
        }
      },
      prod: {
        options: {
          script: 'server.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'server.js'
        }
      }
    },
    casper: {
      acceptance: {
        options: {
          test: true
        },
        files: {
          'test/front-end/acceptance/casper-results.xml': ['test/front-end/acceptance/*_test.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['app/js/**/*.js', 'test/**/*.js', 'api/**/*']
      },
      express: {
        files: ['server.js'],
        tasks: ['browserify'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.registerTask('serve', ['build', 'express:dev', 'watch']);
  grunt.registerTask('server', 'serve');
  grunt.registerTask('test:acceptance', ['express:dev', 'casper']);
  grunt.registerTask('test:unit', ['browserify:test', 'simplemocha']);
  grunt.registerTask('test', ['jshint', 'test:acceptance', 'test:unit']); 
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('build', ['clean', 'browserify', 'copy']);
};