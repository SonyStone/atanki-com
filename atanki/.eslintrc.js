module.exports = {
    "extends": ["google"],
    "parserOptions": {
        "sourceType": "module"
    },
    "globals": {
        "window": true,
        "document": true
    },
    "rules": {
        "linebreak-style": "off",
        "sort-vars": "off",
        "max-len" : ["error",
            {
            "ignoreUrls": true,
            "ignoreComments": true,
            "ignoreStrings": true
        }]
    }
};