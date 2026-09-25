// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

import {Test} from "forge-std/Test.sol";
import {ShipdRegistry} from "../../src/ShipdRegistry.sol";

contract ShipdRegistryTest is Test {
    ShipdRegistry internal registry;

    address internal owner = address(this);
    address internal builder = makeAddr("builder");
    address internal verifier = makeAddr("verifier");
    address internal stranger = makeAddr("stranger");

    event BuildRegistered(
        uint256 indexed buildId,
        address indexed builder,
        string metadataURI,
        string submissionRef,
        uint256 registeredAt
    );
    event BuildVerified(uint256 indexed buildId, string verificationRef);

    function setUp() public {
        // Deployed by this test contract, which becomes owner + authorized.
        registry = new ShipdRegistry();
    }

    /// 1. A caller can register a build.
    function test_RegisterBuild() public {
        vm.prank(builder);
        uint256 buildId = registry.registerBuild("ipfs://meta", "ipfs://submission");

        assertEq(buildId, 0);
        assertEq(registry.buildCount(), 1);

        (
            uint256 storedId,
            address storedBuilder,
            string memory metadataURI,
            string memory submissionRef,
            string memory verificationRef,
            uint256 registeredAt
        ) = registry.builds(buildId);

        assertEq(storedId, 0);
        assertEq(storedBuilder, builder);
        assertEq(metadataURI, "ipfs://meta");
        assertEq(submissionRef, "ipfs://submission");
        assertEq(verificationRef, "");
        assertEq(registeredAt, block.timestamp);
    }

    /// 2. The builder is recorded as msg.sender.
    function test_BuilderIsMsgSender() public {
        vm.prank(builder);
        uint256 buildId = registry.registerBuild("meta", "sub");

        (, address storedBuilder,,,,) = registry.builds(buildId);
        assertEq(storedBuilder, builder);
    }

    /// 3. buildId increments correctly.
    function test_BuildIdIncrements() public {
        vm.prank(builder);
        uint256 first = registry.registerBuild("m0", "s0");
        vm.prank(stranger);
        uint256 second = registry.registerBuild("m1", "s1");

        assertEq(first, 0);
        assertEq(second, 1);
        assertEq(registry.buildCount(), 2);
    }

    /// 4. BuildRegistered is emitted.
    function test_EmitsBuildRegistered() public {
        vm.expectEmit(true, true, false, true);
        emit BuildRegistered(0, builder, "meta", "sub", block.timestamp);

        vm.prank(builder);
        registry.registerBuild("meta", "sub");
    }

    /// 5. Unauthorized verification reverts.
    function test_RevertWhen_UnauthorizedVerification() public {
        vm.prank(builder);
        uint256 buildId = registry.registerBuild("meta", "sub");

        vm.expectRevert(ShipdRegistry.NotAuthorized.selector);
        vm.prank(stranger);
        registry.recordVerification(buildId, "ipfs://verification");
    }

    /// 6. An authorized address can record verification.
    function test_AuthorizedCanRecordVerification() public {
        vm.prank(builder);
        uint256 buildId = registry.registerBuild("meta", "sub");

        registry.setAuthorized(verifier, true);

        vm.expectEmit(true, false, false, true);
        emit BuildVerified(buildId, "ipfs://verification");

        vm.prank(verifier);
        registry.recordVerification(buildId, "ipfs://verification");

        (,,,, string memory verificationRef,) = registry.builds(buildId);
        assertEq(verificationRef, "ipfs://verification");
    }

    /// 7. Only the owner can change authorization.
    function test_OnlyOwnerCanSetAuthorized() public {
        vm.expectRevert(ShipdRegistry.NotOwner.selector);
        vm.prank(stranger);
        registry.setAuthorized(verifier, true);

        // Owner (this contract) succeeds.
        registry.setAuthorized(verifier, true);
        assertTrue(registry.isAuthorized(verifier));
    }
}
