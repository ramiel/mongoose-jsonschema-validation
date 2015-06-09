/* jshint expr: true */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    JsonSchemaValidation = require('../index'),
    expect = require('chai').expect,
    util = require('util');

if(process.env.TRAVIS){
    process.env.MONGOOSE_JSONSCHEMA_CONFIG = '../test-travis.json';
}

var configuration,
    configuration_file = process.env.MONGOOSE_JSONSCHEMA_CONFIG || '../test-connection.json';


describe('Loading plugin', function(){

    before('connecting to mongo', function(done){
        try{
            configuration = require(configuration_file);
        }catch(e){
            done('Missing configuration ' + configuration_file);
        }
        mongoose.connect(configuration.uri, configuration.options || {}, done);
    });

    describe('With a Person schema', function(){

        it('apply the plugin with schema absolute path works', function(){

            var PersonSchema = new Schema({
                name: String
            });
            function t(){
                PersonSchema.plugin(JsonSchemaValidation, {
                    jsonschema:  __dirname + '/fixtures/person.json'
                });
            }
            expect(t).to.not.throw(Error);

        });

        it('apply the plugin with schema relative path rise an exception', function(){

            var PersonSchema = new Schema({
                name: String
            });
            function t(){
                PersonSchema.plugin(JsonSchemaValidation, {
                    jsonschema:  './fixtures/person.json'
                });
            }
            expect(t).to.throw(Error);

        });

        it('apply the plugin with schema object works', function(){

            var PersonSchema = new Schema({
                name: String
            });
            function t(){
                PersonSchema.plugin(JsonSchemaValidation, {
                    jsonschema:  require(__dirname + '/fixtures/person.json')
                });
            }
            expect(t).to.not.throw(Error);

        });

        describe('with a model', function(){

            var PersonSchema,
                Person;

            before('building the model', function(){
                PersonSchema = new Schema({
                    name: String
                });
                PersonSchema.plugin(JsonSchemaValidation, {
                    jsonschema:  __dirname + '/fixtures/person.json'
                });
                
                Person = mongoose.model('Person', PersonSchema);
            });

            it('save well built people', function(done){
                var p = new Person({name: 'Edward'});
                p.save(done);
            });

            it('raise an error with bad built people', function(done){
                var p = new Person({name: ''});
                p.save(function(err){
                    expect(err).to.be.ok;
                    done();
                });
            });
        
        });

        describe('with a model with additional validators', function(){

            var PersonSchema,
                Person,
                CustomError;

            before('creating a custom error class',function(){
                CustomError = function(){
                    Error.apply(this,Array.prototype.slice.call(arguments));
                };
                util.inherits(CustomError, Error);
            });

            before('building the model', function(){
                
                PersonSchema = new Schema({
                    name: {type: String, match: /^a.*/i}
                });
                PersonSchema.plugin(JsonSchemaValidation, {
                    jsonschema:  __dirname + '/fixtures/person.json',
                    errorClass: CustomError
                });
                
                Person = mongoose.model('Person2', PersonSchema);
            });

            it('save well built people', function(done){
                var p = new Person({name: 'Albert'});
                p.save(done);
            });

            it('raise a ValidationError with bad built people (internal validation)', function(done){
                var p = new Person({name: 'Edward'});
                p.save(function(err){
                    expect(err).to.be.ok.and.to.be.instanceOf(mongoose.Error.ValidationError);
                    done();
                });
            });

            it('raise a CustomError with bad built people', function(done){
                var p = new Person({name: ''});
                p.save(function(err){
                    expect(err).to.be.ok.and.to.be.instanceOf(CustomError);
                    done();
                });
            });
        
        });
        
    });
});
