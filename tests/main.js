var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    JsonSchemaValidation = require('../index'),
    expect = require('chai').expect;

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

        it('apply the plugin with schema path (absolute)', function(){

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

        it('apply the plugin with schema path (relative)', function(){

            var PersonSchema = new Schema({
                name: String
            });
            function t(){
                PersonSchema.plugin(JsonSchemaValidation, {
                    jsonschema:  './fixtures/person.json'
                });
            }
            expect(t).to.not.throw(Error);

        });
        
    });
});