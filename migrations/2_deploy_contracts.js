var iToken = artifacts.require("./iToken.sol");

module.exports = function(deployer) {
  deployer.deploy(iToken);
};
