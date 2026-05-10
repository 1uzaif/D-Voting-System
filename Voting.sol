// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;
    bool public votingOpen = false;
    
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    
    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    
    event VoteCast(address voter, uint256 candidateIndex);
    event VotingStarted();
    event VotingEnded();
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        // Add some default candidates
        candidates.push(Candidate("Candidate A", 0));
        candidates.push(Candidate("Candidate B", 0));
        candidates.push(Candidate("Candidate C", 0));
    }
    
    function addCandidate(string memory _name) public onlyAdmin {
        candidates.push(Candidate(_name, 0));
    }
    
    function startVoting() public onlyAdmin {
        votingOpen = true;
        emit VotingStarted();
    }
    
    function endVoting() public onlyAdmin {
        votingOpen = false;
        emit VotingEnded();
    }
    
    function vote(uint256 candidateIndex) public {
        require(votingOpen, "Voting is not open");
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");
        
        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount++;
        
        emit VoteCast(msg.sender, candidateIndex);
    }
    
    function getCandidatesCount() public view returns (uint256) {
        return candidates.length;
    }
    
    function getCandidate(uint256 index) public view returns (string memory, uint256) {
        require(index < candidates.length, "Invalid index");
        return (candidates[index].name, candidates[index].voteCount);
    }
    
    function isVotingOpen() public view returns (bool) {
        return votingOpen;
    }
}
