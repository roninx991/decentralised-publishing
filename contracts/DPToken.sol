pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract GLDToken is ERC20 {

    string public name = "DPToken";
    string public symbol = "DPT";
    uint8 public decimals = 2;
    uint public INITIAL_SUPPLY = 120000;

    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}