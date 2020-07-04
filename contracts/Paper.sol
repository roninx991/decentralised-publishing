pragma solidity ^0.5.0;

contract PaperContractArchived {

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

    function createPaper(string memory idr, string memory title) public {
        papers[idr].identifier = idr;
        papers[idr].title = title;
        papers[idr].owner = msg.sender;
        papers[idr].author = msg.sender;
        papers[idr].rating = 0;
        papers[idr].status = false;
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

    function getPaperRating(string memory idr) public view returns (address) {
        return papers[idr].owner;
    }

    function addToPaperRating(string memory idr, uint rating) private {
        papers[idr].rating += rating;
    }

    function getPaperStatus(string memory idr) public view returns (bool) {
        return papers[idr].status;
    }

    function getPaperReviewers(string memory idr) public view returns(address[] memory)
    {
        return papers[idr].reviewers;
    }

    function addPaperReviewer(string memory idr, address reviewer) public {
        papers[idr].reviewers.push(reviewer);
    }
}