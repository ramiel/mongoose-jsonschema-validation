# Mongoose JSON Schema Validation

[![Build Status](https://travis-ci.org/ramiel/mongoose-jsonschema-validation.svg?branch=master)](https://travis-ci.org/ramiel/mongoose-jsonschema-validation)
[![Coverage Status](https://coveralls.io/repos/ramiel/mongoose-jsonschema-validation/badge.svg)](https://coveralls.io/r/ramiel/mongoose-jsonschema-validation)

Test your mongoose models through JSON schema validator.

## Installation

`npm install --save mongoose-jsonschema-validation`

Is intended to be used as [mongoose]() plugin.

## General

This module will let you validate your model through [json schema](http://json-schema.org/).

To enable validation for your models first you have to create a json schema like this one:

```json
// personschema.json
{
    "$schema": "http://json-schema.org/schema#",
    "title": "Person schema",
    "description": "",
    "type": "object",
    "properties": {
        "_id": {
            "type": "object"
        },
        "name": {
            "type": "string",
            "minLength": 1
        }
    },
    "additionalProperties": false,
    "required": ["name"]
}
```

Then create a schema like always:

```javascript
var PersonSchema = new Schema({
    name: String
});
```

Apply the plugin to your schema:

```javascript
var JsonSchemaValidation = require('mongoose-jsonschema-validation');

PersonSchema.plugin(JsonSchemaValidation, {
    jsonschema:  __dirname + '/personschema.json'
});
```

Now everytime you save your model it is checked aginst the schema. If it is invalid, the save callback will be called with the validation error.

To apply the json schema [tv4](https://github.com/geraintluff/tv4), a quick and performant json-schema-v4 library, is used. Please refer to its documentation to write a valid json schema.

## Options

The **JsonSchemaValidation** plugin accept two options

- **jsonschema**: which is mandatory is the absolute path to the json schema or the json schema itself.
- **errorClass**: is a constructor used to build a new validation error. t's optional and the default is `Error`.

## Faq

Can I use regular validation?

Yes, you can mix both validations, the regular one from mongoose and the json schema. Because this plugin use the pre-save hook, if the regular validation issue an error the json schema it's not checked at all. The custom error class is also used only for the json schema validation errors, not for the regular ones (which will be a `mongoose.Error.ValidationError`).

Which capability of json schema are supported?

The same which are supported from [tv4](https://github.com/geraintluff/tv4).

## Tests

To test the library simply

`npm test`
