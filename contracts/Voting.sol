// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Struct to represent a candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Struct to represent a voter
    struct Voter {
        bool authorized;
        bool voted;
        uint vote;
    }

    address public owner;
    mapping(address => Voter) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    event CandidateAdded(uint id, string name);
    event VoteCasted(address voter, uint candidateId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to add a candidate (owner only)
    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    // Function to authorize a voter (owner only)
    function authorizeVoter(address _voter) public onlyOwner {
        require(!voters[_voter].authorized, "Voter is already authorized");
        voters[_voter].authorized = true;
    }

    // Function to vote
    function vote(uint _candidateId) public {
        Voter storage sender = voters[msg.sender];
        require(sender.authorized, "You are not authorized to vote");
        require(!sender.voted, "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");

        sender.voted = true;
        sender.vote = _candidateId;

        candidates[_candidateId].voteCount++;

        emit VoteCasted(msg.sender, _candidateId);
    }

    // Function to get the total votes for a candidate
    function getVoteCount(uint _candidateId) public view returns (uint) {
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        return candidates[_candidateId].voteCount;
    }
}
