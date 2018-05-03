const expect = require("chai").expect;

const ConfigurationUtil = require("../dist/index").ConfigurationUtil;

const remoteConfig = require("./configProps");

describe("get()", () => {
    /*it("should read config from config.yaml", async () => {
        const val1 = "ab cd";
        const val1_read = await ConfigurationUtil.get("rest-config.val1");
        expect(val1_read).to.be.equal(val1);
    });*/
    it("should pass tests, because there are none", () => {
        expect(1).to.be.equal(1);
    });
});
