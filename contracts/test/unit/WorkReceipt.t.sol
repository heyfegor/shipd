// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

import {Test} from "forge-std/Test.sol";
import {WorkReceipt} from "../../src/WorkReceipt.sol";

contract WorkReceiptTest is Test {
    WorkReceipt internal workReceipt;

    address internal issuer = makeAddr("issuer");
    address internal worker = makeAddr("worker");
    address internal stranger = makeAddr("stranger");

    event ReceiptCreated(
        uint256 indexed receiptId,
        uint256 indexed buildId,
        address indexed worker,
        string verificationRef,
        bytes32 evidenceHash,
        uint256 issuedAt
    );

    function setUp() public {
        // Deployed by this test contract, which becomes owner + authorized.
        workReceipt = new WorkReceipt();
    }

    /// 1. Unauthorized receipt creation reverts.
    function test_RevertWhen_UnauthorizedCreateReceipt() public {
        vm.expectRevert(WorkReceipt.NotAuthorized.selector);
        vm.prank(stranger);
        workReceipt.createReceipt(0, worker, "ipfs://verification", keccak256("evidence"));
    }

    /// 2. An authorized address can create a receipt.
    function test_AuthorizedCanCreateReceipt() public {
        workReceipt.setAuthorized(issuer, true);

        bytes32 evidence = keccak256("evidence");
        vm.prank(issuer);
        uint256 receiptId = workReceipt.createReceipt(42, worker, "ipfs://verification", evidence);

        assertEq(receiptId, 0);
        assertEq(workReceipt.receiptCount(), 1);

        (
            uint256 storedId,
            uint256 buildId,
            address storedWorker,
            string memory verificationRef,
            bytes32 evidenceHash,
            uint256 issuedAt
        ) = workReceipt.receipts(receiptId);

        assertEq(storedId, 0);
        assertEq(buildId, 42);
        assertEq(storedWorker, worker);
        assertEq(verificationRef, "ipfs://verification");
        assertEq(evidenceHash, evidence);
        assertEq(issuedAt, block.timestamp);
    }

    /// 3. receiptId increments correctly.
    function test_ReceiptIdIncrements() public {
        // Owner is authorized by default; create directly from this contract.
        uint256 first = workReceipt.createReceipt(1, worker, "v0", keccak256("e0"));
        uint256 second = workReceipt.createReceipt(2, worker, "v1", keccak256("e1"));

        assertEq(first, 0);
        assertEq(second, 1);
        assertEq(workReceipt.receiptCount(), 2);
    }

    /// 4. ReceiptCreated is emitted.
    function test_EmitsReceiptCreated() public {
        bytes32 evidence = keccak256("evidence");

        vm.expectEmit(true, true, true, true);
        emit ReceiptCreated(0, 7, worker, "ipfs://verification", evidence, block.timestamp);

        workReceipt.createReceipt(7, worker, "ipfs://verification", evidence);
    }

    /// 5. Only the owner can change authorization.
    function test_OnlyOwnerCanSetAuthorized() public {
        vm.expectRevert(WorkReceipt.NotOwner.selector);
        vm.prank(stranger);
        workReceipt.setAuthorized(issuer, true);

        // Owner (this contract) succeeds.
        workReceipt.setAuthorized(issuer, true);
        assertTrue(workReceipt.isAuthorized(issuer));
    }
}
