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
      all: ['Gruntfile.js', 'server.js', './test/**/*.js', 'app/js/**/*.js']
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
      }
    },
    simplemocha: {
      options: {
        ui: 'bdd',
      }, 
      all: { src: ['./test/api/**/*.js'] }
    },
    express: {
      dev: {
        options: {
          background: true,
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
          pre: 'node server.js',
          verbose: true,
          'log-level': 'debug',
          test: true
        },
        files: {
          '/dev/null': ['test/acceptance/*_test.js']
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
    },
    shell: {
      mongodb: {
        command: 'mongod --dbpath ./db',
        options: {
          async: true,
          stdout: false,
          stderr: true,
          failOnError: true,
          execOptions: {
            cwd: '.'
          }
        }
      }
    }
  });

  grunt.registerTask('serve', ['build', 'express:dev', 'watch']);
  grunt.registerTask('server', 'serve');
  grunt.registerTask('test:acceptance', ['express:dev', 'casper']);
  grunt.registerTask('test:api', 'simplemocha');
  grunt.registerTask('test', ['test:acceptance', 'test:api']); 
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('build', ['clean', 'browserify', 'copy']);
};