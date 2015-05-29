var _ = require('lodash'),
    tv4 = require('tv4'),
    JsonSchemaValidation;

/**
 * Load a schema from a path or from a schema object
 * @param  {string|object} schema Can be the path or the schema itself
 * @return {obj}        The json schema
 * @throws {Error} If there is error including he schema from a path
 * @ignore
 */
function loadSchema(schema){
    var obj;
    if(typeof schema === 'string'){
        obj = require(schema);
    }
    return obj;
}

/**
 * Mongoose plugin to validate models with Json Schema validation
 * @param {object} schema  Mongoose schema
 * @param {object} options Options for validation
 * @param {string|object} options.jsonschema Path of the json schema or the schema itself
 * @param {string} [options.errorClass=Error] Error class to be used on validation errors
 * @throws {Error} If there is error including he schema from a path
 */
JsonSchemaValidation = function(schema, options) {

    var defaults = {
            jsonschema: null,
            errorClass: Error
        };

    options = _.extend(defaults, options);
    options.jsonschema = loadSchema(options.jsonschema);

    schema.pre('save', (function(options) {
            return function(next) {
                var validation = tv4.validateMultiple(this.toObject(), options.jsonschema);
                next(!validation.valid ? new options.errorClass(validation.errors) : null);
            };
        })(options)
    );

};

module.exports = JsonSchemaValidation;