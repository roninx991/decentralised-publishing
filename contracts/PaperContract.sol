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

    function changeOwnership(string memory id, address newOwner) public {
        papers[id].owner = newOwner;
    }

    function getStatus(string memory id) public view returns (bool) {
        return papers[id].status;
    }

    function getRating(string memory id) public view returns (uint) {
        return papers[id].rating;
    }

    function setRating(string memory id, uint r) public {
        require(papers[id].reviewers.length < 5, "Maximum reviewers for paper reached");
        papers[id].rating = r;
    }

    function getReviewers(string memory id) public view returns (address[] memory) {
        return papers[id].reviewers;
    }

    function addReviewers(string memory id, address reviewer) public {
        require(papers[id].owner != reviewer, "Author cannot review his own paper");
        papers[id].reviewers.push(reviewer);
        if (papers[id].reviewers.length == 5) {
            papers[id].status = true;
        }
    }
}