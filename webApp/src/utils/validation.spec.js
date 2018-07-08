const should = require("chai").should();
const validation = require('./validation');
const types = require('./validation').types;

describe("validation function", function(){

    let defination = { username: types.string.isRequired };

    it("should give error when no paramter ", done => {
        let req = { body : {} }, result;
        let next = error => result = error;
        validation(defination)(req, null, next);
        result.should.not.equal(null);
        done()
    });

    it("should give error when wrong type paramter ", done => {
        let req = { body : { username : 123 } }, result;
        let next = error => result = error;
        validation(defination)(req, null, next);
        result.should.not.equal(null);
        done()
    });

    it("should success to pass the validation", done => {
        let req = { body : { username : "kenyip" } }, result;
        let next = error => result = error;
        validation(defination)(req, null, next);
        should.not.exist( result );
        done()
    });

});
