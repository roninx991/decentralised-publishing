pragma solidity ^0.5.0;

contract PaperContract {
    struct Paper {
        address author;
        address owner;
        uint rating;
        bool status;
        address[] reviewers;
    }

    mapping(string => Paper) private papers;

    function createPaper(string memory id) public {
        papers[id].author = msg.sender;
        papers[id].owner = msg.sender;
        papers[id].status = false;
    }

    function getAuthor(string memory id) public view returns (address) {
        return papers[id].author;
    }

    function getOwner(string memory id) public view returns (address) {
        return papers[id].owner;
    }

    function getStatus(string memory id) public view returns (bool) {
        return papers[id].status;
    }

    function getRating(string memory id) public view returns (uint) {
        return papers[id].rating;
    }
}