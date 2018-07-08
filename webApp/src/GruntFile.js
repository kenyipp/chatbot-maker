module.exports = (grunt) => {
    grunt.loadNpmTasks('grunt-apidoc');
    grunt.initConfig({
        apidoc: {
            mypp: {
                src: "./",
                dest: "../docs",
                options: {
                    debug: false,
                    log: true,
                    includeFilters: [ ".*\\.js$" ],
                    excludeFilters: [ "node_modules/" ]
                }
            }
        }
    });
};