// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseWorkflowProofRegistry {
    address public owner;

    struct ProofRecord {
        address recorder;
        uint64 recordedAt;
        bool exists;
    }

    mapping(bytes32 => ProofRecord) public proofRecords;

    event ProofRecorded(
        bytes32 indexed proofHash,
        address indexed recorder,
        uint64 recordedAt
    );

    constructor(address initialOwner) {
        require(initialOwner != address(0), "owner required");
        owner = initialOwner;
    }

    function recordProof(bytes32 proofHash) external {
        require(proofHash != bytes32(0), "proof required");
        require(!proofRecords[proofHash].exists, "proof exists");

        proofRecords[proofHash] = ProofRecord({
            recorder: msg.sender,
            recordedAt: uint64(block.timestamp),
            exists: true
        });

        emit ProofRecorded(proofHash, msg.sender, uint64(block.timestamp));
    }
}
