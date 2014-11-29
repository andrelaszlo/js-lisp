module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Unit tests.
    nodeunit: {
      tests: ['test/*'],
      options: {
        reporter: 'verbose'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Default task(s).
  grunt.registerTask('default', ['nodeunit']);


};
