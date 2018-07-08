const app       = require('../'),
      should    = require("chai").should(),
      supertest = require("supertest"),
      request   = supertest(app),
      Chance    = require("chance"),
      chance    = new Chance();

describe(`User API Endpoints`, ()=>{

    let admin = {
        username : "admin",
        password : "123456"
    };

    beforeEach('Setting admin account', done =>{
        try {
            request.get('/api/user/setup')
        } catch ( error ){} finally {
            done();
        }
    });

    describe('POST /api/user/login', () => {

        it('should reject with code 400 if parameters is not given', done => {
            request
                .post('/api/user/login')
                .send()
                .expect( 400 )
                .end( (error, response)=>{
                    if ( error )
                        return done( error.message );
                    done();
                });
        });

        it('should reject with code 401 if password goes wrong', done => {
            request
                .post('/api/user/login')
                .send({ username: admin.username, password: chance.address() })
                .expect( 401 )
                .end( (error, response)=>{
                    if ( error )
                        return done( error.message );
                    done();
                });
        });

        it('should sucess to login if username and password is correct', done => {
            request
                .post('/api/user/login')
                .send( admin )
                .expect( 200 )
                .end( (error, response)=>{
                    if ( error )
                        return done( error.message );
                    response.body.should.have.property('access_token');
                    response.body.should.have.property('user');
                    done();
                });
        });
        
    });
    
});