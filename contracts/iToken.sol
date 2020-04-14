pragma solidity >=0.4.21 <0.7.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract iToken is ERC20, ERC20Detailed {
    constructor () public ERC20Detailed("iToken", "iTKN", 18) {
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
    }
}
