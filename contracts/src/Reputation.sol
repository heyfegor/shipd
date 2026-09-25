// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

/// @title Reputation
/// @notice Records reputation events derived from work receipts. Final step of
///         the Shipd flow: WORK RECEIPT -> REPUTATION EVENT.
/// @dev Only authorized Shipd addresses may record reputation events. V1 stores
///      raw events; aggregation is left off-chain.
contract Reputation {
    /// @notice A recorded reputation event.
    struct ReputationEvent {
        uint256 eventId; // unique, monotonic identifier
        address subject; // address the reputation event is about
        uint256 receiptId; // work receipt this event derives from (WorkReceipt)
        int256 value; // reputation value (may be positive or negative)
        bytes32 eventType; // event type / reference tag
        uint256 recordedAt; // block timestamp at recording
    }

    /// @notice Protocol owner, able to manage authorized addresses.
    address public owner;

    /// @notice Addresses authorized to record reputation events.
    mapping(address => bool) public isAuthorized;

    /// @notice Total number of recorded events; also the next eventId.
    uint256 public eventCount;

    /// @notice eventId => ReputationEvent record.
    mapping(uint256 => ReputationEvent) public events;

    /// @notice Emitted when a reputation event is recorded.
    event ReputationRecorded(
        uint256 indexed eventId,
        address indexed subject,
        uint256 indexed receiptId,
        int256 value,
        bytes32 eventType,
        uint256 recordedAt
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

    /// @notice Record a reputation event for a subject, derived from a receipt.
    /// @dev Only an authorized Shipd address may record reputation events.
    /// @param subject The address the reputation event is about.
    /// @param receiptId The work receipt this event derives from.
    /// @param value The reputation value (positive or negative).
    /// @param eventType Event type / reference tag.
    /// @return eventId The unique identifier assigned to the event.
    function recordReputation(
        address subject,
        uint256 receiptId,
        int256 value,
        bytes32 eventType
    ) external onlyAuthorized returns (uint256 eventId) {
        eventId = eventCount++;
        events[eventId] = ReputationEvent({
            eventId: eventId,
            subject: subject,
            receiptId: receiptId,
            value: value,
            eventType: eventType,
            recordedAt: block.timestamp
        });

        emit ReputationRecorded(eventId, subject, receiptId, value, eventType, block.timestamp);
    }
}
