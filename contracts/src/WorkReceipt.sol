// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

/// @title WorkReceipt
/// @notice Issues work receipts for verified builds. A receipt is a protocol
///         record attesting that a worker/agent's contribution to a build was
///         verified. Step: VERIFICATION -> WORK RECEIPT in the Shipd flow.
/// @dev Only authorized Shipd addresses may create receipts.
contract WorkReceipt {
    /// @notice A work receipt.
    struct Receipt {
        uint256 receiptId; // unique, monotonic identifier
        uint256 buildId; // build this receipt is issued for (ShipdRegistry)
        address worker; // worker / agent credited by the receipt
        string verificationRef; // off-chain verification reference
        bytes32 evidenceHash; // hash of the off-chain evidence
        uint256 issuedAt; // block timestamp at issuance
    }

    /// @notice Protocol owner, able to manage authorized addresses.
    address public owner;

    /// @notice Addresses authorized to create receipts.
    mapping(address => bool) public isAuthorized;

    /// @notice Total number of issued receipts; also the next receiptId.
    uint256 public receiptCount;

    /// @notice receiptId => Receipt record.
    mapping(uint256 => Receipt) public receipts;

    /// @notice Emitted when a new work receipt is created.
    event ReceiptCreated(
        uint256 indexed receiptId,
        uint256 indexed buildId,
        address indexed worker,
        string verificationRef,
        bytes32 evidenceHash,
        uint256 issuedAt
    );

    /// @notice Emitted when an address gains or loses authorization.
    event AuthorizationUpdated(address indexed account, bool authorized);

    error NotOwner();
    error NotAuthorized();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyAuthorized() {
        if (!isAuthorized[msg.sender]) revert NotAuthorized();
        _;
    }

    constructor() {
        owner = msg.sender;
        isAuthorized[msg.sender] = true;
        emit AuthorizationUpdated(msg.sender, true);
    }

    /// @notice Grant or revoke authorization for an address.
    function setAuthorized(address account, bool authorized) external onlyOwner {
        isAuthorized[account] = authorized;
        emit AuthorizationUpdated(account, authorized);
    }

    /// @notice Create a work receipt for a verified build.
    /// @dev Only an authorized Shipd address may create receipts.
    /// @param buildId The build the receipt is issued for.
    /// @param worker The worker / agent credited by the receipt.
    /// @param verificationRef Off-chain verification reference.
    /// @param evidenceHash Hash of the off-chain evidence.
    /// @return receiptId The unique identifier assigned to the receipt.
    function createReceipt(
        uint256 buildId,
        address worker,
        string calldata verificationRef,
        bytes32 evidenceHash
    ) external onlyAuthorized returns (uint256 receiptId) {
        receiptId = receiptCount++;
        receipts[receiptId] = Receipt({
            receiptId: receiptId,
            buildId: buildId,
            worker: worker,
            verificationRef: verificationRef,
            evidenceHash: evidenceHash,
            issuedAt: block.timestamp
        });

        emit ReceiptCreated(receiptId, buildId, worker, verificationRef, evidenceHash, block.timestamp);
    }
}
