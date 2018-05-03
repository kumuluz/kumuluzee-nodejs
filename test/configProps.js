const ConfigBundle = require("../dist/index").default;

const remoteConfig = new ConfigBundle({
    prefixKey: "rest-config",
    type: "object",
    fields: {
        val1: {
            type: "string",
            name: "val1",
            watch: true
        },
        val2: {
            type: "number",
            name: "val2"
        },
        val3: {
            type: "object",
            name: "val3",
            fields: {
                val31: {
                    type: "boolean",
                    name: "val31"
                },
                val32: {
                    type: "string",
                    name: "val32"
                }
            }
        }
    }
});

//remoteConfig.initialize({extension: "etcd"});
