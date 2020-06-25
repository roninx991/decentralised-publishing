pragma solidity ^0.5.0;

contract AuthorContract {

    struct Author {
        address account;
        string name;
    }

    mapping(address => Author) public authors;

    function createAuthor(address acc, string memory name) public {
        authors[acc].account = acc;
        authors[acc].name = name;
    }

    function getAuthorName(address account) public view returns (string memory) {
        return authors[account].name;
    }
}