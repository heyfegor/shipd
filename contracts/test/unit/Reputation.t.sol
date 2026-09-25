// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

import {Test} from "forge-std/Test.sol";
import {Reputation} from "../../src/Reputation.sol";

contract ReputationTest is Test {
    Reputation internal reputation;

    address internal recorder = makeAddr("recorder");
    address internal subject = makeAddr("subject");
    address internal stranger = makeAddr("stranger");

    event ReputationRecorded(
        uint256 indexed eventId,
        address indexed subject,
        uint256 indexed receiptId,
        int256 value,
        bytes32 eventType,
        uint256 recordedAt
    );

    function setUp() public {
        // Deployed by this test contract, which becomes owner + authorized.
        reputation = new Reputation();
    }

    /// 1. Unauthorized reputation recording reverts.
    function test_RevertWhen_UnauthorizedRecord() public {
        vm.expectRevert(Reputation.NotAuthorized.selector);
        vm.prank(stranger);
        reputation.recordReputation(subject, 0, int256(10), bytes32("MERGED"));
    }

    /// 2. An authorized address can record a reputation event.
    function test_AuthorizedCanRecord() public {
        reputation.setAuthorized(recorder, true);

        vm.prank(recorder);
        uint256 eventId = reputation.recordReputation(subject, 3, int256(10), bytes32("MERGED"));

        assertEq(eventId, 0);
        assertEq(reputation.eventCount(), 1);

        (
            uint256 storedId,
            address storedSubject,
            uint256 receiptId,
            int256 value,
            bytes32 eventType,
            uint256 recordedAt
        ) = reputation.events(eventId);

        assertEq(storedId, 0);
        assertEq(storedSubject, subject);
        assertEq(receiptId, 3);
        assertEq(value, int256(10));
        assertEq(eventType, bytes32("MERGED"));
        assertEq(recordedAt, block.timestamp);
    }

    /// 3. eventId increments correctly.
    function test_EventIdIncrements() public {
        // Owner is authorized by default; record directly from this contract.
        uint256 first = reputation.recordReputation(subject, 0, int256(1), bytes32("A"));
        uint256 second = reputation.recordReputation(subject, 1, int256(2), bytes32("B"));

        assertEq(first, 0);
        assertEq(second, 1);
        assertEq(reputation.eventCount(), 2);
    }

    /// 4. ReputationRecorded is emitted.
    function test_EmitsReputationRecorded() public {
        vm.expectEmit(true, true, true, true);
        emit ReputationRecorded(0, subject, 5, int256(7), bytes32("MERGED"), block.timestamp);

        reputation.recordReputation(subject, 5, int256(7), bytes32("MERGED"));
    }

    /// 5. Signed reputation values work for both positive and negative values.
    function test_SignedValues() public {
        uint256 positiveId = reputation.recordReputation(subject, 0, int256(100), bytes32("PRAISE"));
        uint256 negativeId = reputation.recordReputation(subject, 1, int256(-50), bytes32("PENALTY"));

        (,,, int256 positiveValue,,) = reputation.events(positiveId);
        (,,, int256 negativeValue,,) = reputation.events(negativeId);

        assertEq(positiveValue, int256(100));
        assertEq(negativeValue, int256(-50));
    }

    /// 6. Only the owner can change authorization.
    function test_OnlyOwnerCanSetAuthorized() public {
        vm.expectRevert(Reputation.NotOwner.selector);
        vm.prank(stranger);
        reputation.setAuthorized(recorder, true);

        // Owner (this contract) succeeds.
        reputation.setAuthorized(recorder, true);
        assertTrue(reputation.isAuthorized(recorder));
    }
}
