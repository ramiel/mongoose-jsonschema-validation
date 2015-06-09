/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    mochacov: {
      test: {
        options: {
          reporter: 'spec'
        }
      },
      coverage: {
        options: {
          coveralls: {
            repoToken: 'OFVnkJEPrVPyAaQ1ZGPjuiK7rYAMg4uYy'
          }
        }
      },
      local_coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          output: 'coverage/coverage.html'
        }
      },
      options: {
        files:{
          src: ['test/**/*.js','!test/fixtures','!test/helpers']
        }
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-cov');

  // Default task.
  grunt.registerTask('default', ['jshint']);
  if(process.env.TRAVIS){
    grunt.registerTask('test', ['mochacov:test', 'mochacov:coverage']);
  }else{
    grunt.registerTask('test', ['mochacov:test', 'mochacov:local_coverage']);
  }

};
