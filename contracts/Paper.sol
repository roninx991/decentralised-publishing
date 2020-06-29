pragma solidity ^0.5.0;

import './DPToken.sol';

contract PaperContract {

    address public contractOwner;

    struct Paper {
        string identifier;
        address author;
        address owner;
        uint rating;
        bool status;
        string title;
        address[] reviewers;
    }

    mapping(string => Paper) private papers;

    DPToken token;

    constructor() public {
        contractOwner = msg.sender;
    }

    function createPaper(string memory idr, string memory title) public {
        papers[idr].identifier = idr;
        papers[idr].title = title;
        papers[idr].owner = msg.sender;
        papers[idr].author = msg.sender;
        papers[idr].rating = 0;
        papers[idr].status = false;
        papers[idr].reviewers = [];
        token.transfer()
    }

    function getPaperTitle(string memory idr) public view returns (string memory) {
        return papers[idr].title;
    }

    function getPaperAuthor(string memory idr) public view returns (address) {
        return papers[idr].author;
    }

    function getPaperOwner(string memory idr) public view returns (address) {
        return papers[idr].owner;
    }

    function setPaperOwner(string memory idr, address newOwner) public {
        papers[idr].owner = newOwner;
    }

    function getPaperStatus(string memory idr) public view returns (bool) {
        return papers[idr].status;
    }
}