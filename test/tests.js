const expect = require("chai").expect;
const path = require("path");

const configurationPath = path.join(__dirname, "..", "test", "config", "config.yaml");
const ConfigurationUtil = require("../dist/index").ConfigurationUtil;
const remoteConfig = require("./configProps").remoteConfig;

let util = null;

setTimeout(() => process.exit(0), 3000);

before("initialize()", async () => {
    await remoteConfig.initialize({
        extension: "etcd",
        configPath: configurationPath
    });
    util = ConfigurationUtil;
});



describe("get()", () => {
    it("remoteConfig object should have value", () => {
        expect(remoteConfig.val1).to.be.equal("ab cd");
        expect(remoteConfig.val3.val31).to.be.equal(true);
        expect(remoteConfig.val2).to.be.equal(123);
    });

    /*
    it("should read config from config.yaml while etcd or consul is running", async () => {
        const val1_read = await util.get("rest-config.val1");
        const val2_read = await util.get("rest-config.val2");
        const val31_read = await util.get("rest-config.val3.val31");
        expect(val1_read).to.be.equal("ab cd");
        expect(val2_read).to.be.equal(123);
        expect(val31_read).to.be.equal(true);
    });
    */
});
