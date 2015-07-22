module.exports = (grunt) ->
  grunt.initConfig

    clean:
      options:
        force: true
      build: ["lib/", "index.js"]

    coffee:
      main:
        expand: true,
        cwd: 'src',
        src: ['**/*.coffee'],
        dest: '.',
        ext: '.js'

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-clean"

  grunt.registerTask "default", ["build"]
  grunt.registerTask "build", [
    "clean"
    "coffee:main"
  ]
