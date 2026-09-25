// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

/// @title ShipdRegistry
/// @notice Records builds in the Shipd protocol. This is the entry point of the
///         flow: USER -> BUILD -> SUBMISSION -> VERIFICATION -> WORK RECEIPT -> REPUTATION.
/// @dev V1 stores build metadata and off-chain references only. Verification and
///      work receipts are recorded by authorized Shipd addresses.
contract ShipdRegistry {
    /// @notice A registered build.
    struct Build {
        uint256 buildId; // unique, monotonic identifier
        address builder; // owner / builder of the build
        string metadataURI; // off-chain build metadata reference
        string submissionRef; // off-chain submission reference
        string verificationRef; // off-chain verification reference (set on verify)
        uint256 registeredAt; // block timestamp at registration
    }

    /// @notice Protocol owner, able to manage authorized addresses.
    address public owner;

    /// @notice Addresses authorized to record protocol data (e.g. verification).
    mapping(address => bool) public isAuthorized;

    /// @notice Total number of registered builds; also the next buildId.
    uint256 public buildCount;

    /// @notice buildId => Build record.
    mapping(uint256 => Build) public builds;

    /// @notice Emitted when a new build is registered.
    event BuildRegistered(
        uint256 indexed buildId,
        address indexed builder,
        string metadataURI,
        string submissionRef,
        uint256 registeredAt
    );

    /// @notice Emitted when a verification reference is recorded for a build.
    event BuildVerified(uint256 indexed buildId, string verificationRef);

    /// @notice Emitted when an address gains or loses authorization.
    event AuthorizationUpdated(address indexed account, bool authorized);

    error NotOwner();
    error NotAuthorized();
    error UnknownBuild();

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

    /// @notice Register a new build. The caller is recorded as the builder.
    /// @param metadataURI Off-chain build metadata reference.
    /// @param submissionRef Off-chain submission reference.
    /// @return buildId The unique identifier assigned to the build.
    function registerBuild(string calldata metadataURI, string calldata submissionRef)
        external
        returns (uint256 buildId)
    {
        buildId = buildCount++;
        builds[buildId] = Build({
            buildId: buildId,
            builder: msg.sender,
            metadataURI: metadataURI,
            submissionRef: submissionRef,
            verificationRef: "",
            registeredAt: block.timestamp
        });

        emit BuildRegistered(buildId, msg.sender, metadataURI, submissionRef, block.timestamp);
    }

    /// @notice Record a verification reference for an existing build.
    /// @dev Only an authorized Shipd address may record verification.
    function recordVerification(uint256 buildId, string calldata verificationRef) external onlyAuthorized {
        Build storage build = builds[buildId];
        if (build.builder == address(0)) revert UnknownBuild();

        build.verificationRef = verificationRef;
        emit BuildVerified(buildId, verificationRef);
    }
}
