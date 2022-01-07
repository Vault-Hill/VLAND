const { expect } = require('chai');

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const VLAND = artifacts.require('VLAND');

contract('VLAND', (accounts) => {
    const [deployerAddress, satoshiAddress, vitalikAddress] = accounts;

    let vland;
    beforeEach(async() => {
        vland = await VLAND.deployed();
    })

    const getNewInitialisedVland = async (admin, baseUri) => {
        const instance = await VLAND.new();
        
        await instance.initialize(
            admin,
            "Vault Hill Land",
            "VLAND",
            baseUri,
            1000000000
        );
        return instance;
    }

    describe('Initial State', () => {
        it('name returns the correct value', async () => {
            const name = await vland.name();
            expect(name).to.equal("Vault Hill Land");
        });
        
        it('symbol returns the correct value', async () => {
            const name = await vland.symbol();
            expect(name).to.equal("VLAND");
        });
    
        it('maxSupply returns the correct value', async () => {
            const supply = await vland.maxSupply();
            const expectedSupply = new BN(500000000)
            expect(supply).to.be.bignumber.equal(expectedSupply);
        });
    });

    describe('AccessControl', () => {
        it('hasRole returns true for the DEFAULT_ADMIN_ROLE and deploy parameter admin address', async () => {
            const adminRole = await vland.DEFAULT_ADMIN_ROLE();
            console.log(`vland`, vland);
            const hasAdminRole = await vland.hasRole(adminRole, deployerAddress);
            expect(hasAdminRole).to.be.true;
        });
    
        it('grantRole emits an event if successful', async () => {
            const adminRole = await vland.DEFAULT_ADMIN_ROLE();
            const hasAdminRole = await vland.hasRole(adminRole, deployerAddress);
            expect(hasAdminRole).to.be.true;
            
            const minterRole = await vland.MINTER_ROLE();
            const receipt = await vland.grantRole(minterRole, satoshiAddress);
    
            expectEvent(receipt, 'RoleGranted', { role: minterRole, account: satoshiAddress, sender: deployerAddress });
        });
        
        it('hasRole returns true for MINTER_ROLE after the role has been granted', async () => {
            const adminRole = await vland.DEFAULT_ADMIN_ROLE();
            const hasAdminRole = await vland.hasRole(adminRole, deployerAddress);
            expect(hasAdminRole).to.be.true;
            
            const minterRole = await vland.MINTER_ROLE();
            await vland.grantRole(minterRole, satoshiAddress);
    
            const hasMinterRole = await vland.hasRole(minterRole, satoshiAddress);
            expect(hasMinterRole).to.be.true;
        });
    
        it('grantRole reverts if the caller is not the role admin', async () => {
            const adminRole = await vland.DEFAULT_ADMIN_ROLE();
            const hasAdminRole = await vland.hasRole(adminRole, satoshiAddress);
            expect(hasAdminRole).to.be.false;
    
            const minterRole = await vland.MINTER_ROLE();        
            const expectedError = `AccessControl: account ${satoshiAddress.toLowerCase()} is missing role ${adminRole.toLowerCase()} -- Reason given: AccessControl: account ${satoshiAddress.toLowerCase()} is missing role ${adminRole.toLowerCase()}.`
    
            await expectRevert(
                vland.grantRole(minterRole, satoshiAddress, { from: satoshiAddress }),
                expectedError
            );
        });
    
        it('revokeRole emits an event if successful', async () => {
            const adminRole = await vland.DEFAULT_ADMIN_ROLE();
            const hasAdminRole = await vland.hasRole(adminRole, deployerAddress);
            expect(hasAdminRole).to.be.true;
            
            const minterRole = await vland.MINTER_ROLE();
            await vland.grantRole(minterRole, satoshiAddress);
    
            const hasMinterRoleBeforeRevoke = await vland.hasRole(minterRole, satoshiAddress);
            expect(hasMinterRoleBeforeRevoke).to.be.true;
            
            const receipt = await vland.revokeRole(minterRole, satoshiAddress)
            expectEvent(receipt, 'RoleRevoked', { role: minterRole, account: satoshiAddress, sender: deployerAddress });
        });
        
        it('hasRole returns false for MINTER_ROLE after the role has been revoked', async () => {
            const adminRole = await vland.DEFAULT_ADMIN_ROLE();
            const hasAdminRole = await vland.hasRole(adminRole, deployerAddress);
            expect(hasAdminRole).to.be.true;
            
            const minterRole = await vland.MINTER_ROLE();
            await vland.grantRole(minterRole, satoshiAddress);
    
            const hasMinterRoleBeforeRevoke = await vland.hasRole(minterRole, satoshiAddress);
            expect(hasMinterRoleBeforeRevoke).to.be.true;
            
            await vland.revokeRole(minterRole, satoshiAddress);
            
            const hasMinterRoleAfterRevoke = await vland.hasRole(minterRole, satoshiAddress);
            expect(hasMinterRoleAfterRevoke).to.be.false;
        });
        
        it('revokeRole reverts if the caller is not the role admin', async () => {
            const adminRole = await vland.DEFAULT_ADMIN_ROLE();
            const hasAdminRole = await vland.hasRole(adminRole, deployerAddress);
            expect(hasAdminRole).to.be.true;
            
            const minterRole = await vland.MINTER_ROLE();
            await vland.grantRole(minterRole, satoshiAddress);
    
            const hasMinterRoleBeforeRevoke = await vland.hasRole(minterRole, satoshiAddress);
            expect(hasMinterRoleBeforeRevoke).to.be.true;
            
            const expectedError = `AccessControl: account ${vitalikAddress.toLowerCase()} is missing role ${adminRole.toLowerCase()} -- Reason given: AccessControl: account ${vitalikAddress.toLowerCase()} is missing role ${adminRole.toLowerCase()}.`
            await expectRevert(
                vland.revokeRole(minterRole, satoshiAddress, { from: vitalikAddress }),
                expectedError
            );
        });  
    });

    describe('mintLAND', () => {
        it('reverts if the user does not have the MINTER_ROLE', async () => {
            const minterRole = await vland.MINTER_ROLE();
            const expectedError = `AccessControl: account ${deployerAddress.toLowerCase()} is missing role ${minterRole.toLowerCase()} -- Reason given: AccessControl: account ${deployerAddress.toLowerCase()} is missing role ${minterRole.toLowerCase()}.`
            
            await expectRevert(
                vland.mintLAND(1, deployerAddress, 'token-1'),
                expectedError
            );
        });
    
        it('reverts if the `_to` parameter is the 0 address', async () => {
            const minterRole = await vland.MINTER_ROLE();
            const expectedError = "_to cannot be address 0";
    
            await vland.grantRole(minterRole, deployerAddress);
            
            await expectRevert(
                vland.mintLAND(1, constants.ZERO_ADDRESS, 'token-1'),
                expectedError
            );
        });
    
        it('reverts if the the token ID already exists', async () => {
            const minterRole = await vland.MINTER_ROLE();
            
            await vland.grantRole(minterRole, deployerAddress);
            
            await vland.mintLAND(1, deployerAddress, 'token-1');
            
            const expectedError = "Token with specified ID already exists";
            await expectRevert(
                vland.mintLAND(1, deployerAddress, 'token-1'),
                expectedError
            );
        });
    
        it('emits a transfer event with the correct data', async () => {
            const minterRole = await vland.MINTER_ROLE();        
            await vland.grantRole(minterRole, deployerAddress);
            
            const receipt = await vland.mintLAND(2, deployerAddress, 'token-2');
    
            expectEvent(receipt, 'Transfer', { from: constants.ZERO_ADDRESS, to: deployerAddress, tokenId: new BN(2) });
        });
    
        it('increases the totalSupply ', async () => {
            const supplyBefore = await vland.totalSupply();
            expect(supplyBefore).to.be.bignumber.equal(new BN(2));
    
            await vland.mintLAND(3, deployerAddress, 'token-3');
    
            const supplyAfter = await vland.totalSupply();
            expect(supplyAfter).to.be.bignumber.equal(new BN(3));
        });
    })

    describe('tokensOfOwner', () => {
        it('reverts if querying the zero address', async () => {
            await expectRevert(
                vland.tokensOfOwner(constants.ZERO_ADDRESS),
                "ERC721: balance query for the zero address"
            )
        });

        it('returns an empty array if the owner owns no tokens', async () => {
            const tokens = await vland.tokensOfOwner(vitalikAddress);
            expect(tokens).to.be.deep.equal([]);
        });

        it('returns an array with a single item if the owner owns one token', async () => {
            await vland.mintLAND(4, vitalikAddress, 'token-4');

            const tokens = await vland.tokensOfOwner(vitalikAddress);
            expect(tokens.map(t => t.toNumber())).to.be.deep.equal([4]);
        })

        it('returns an array with multiple items if the owner owns multiple tokens', async () => {
            const tokens = await vland.tokensOfOwner(deployerAddress);
            expect(tokens.map(t => t.toNumber())).to.be.deep.equal([1, 2, 3]);
        })
    })

    describe('tokenURI', () => {
        it('reverts if the token ID does not belong to an existing token', async () => {
            const expectedError = "URI query for nonexistent token";
            await expectRevert(
                vland.tokenURI(10),
                expectedError
            );
        });

        it('returns the token URI suffix if there is no base URI', async () => {
            const freshVland = await getNewInitialisedVland(deployerAddress, "");
            
            const minterRole = await freshVland.MINTER_ROLE();
            await freshVland.grantRole(minterRole, deployerAddress);
            
            const uri = 'token-1';
            await freshVland.mintLAND(1, deployerAddress, uri);

            const tokenURI = await freshVland.tokenURI(1);
            expect(tokenURI).to.equal(uri);
        });

        it('returns the concantenated token URI if base URI and tokenURI are set', async () => {
            const baseUri = "vaulthill.io/";
            const freshVland = await getNewInitialisedVland(deployerAddress, baseUri);

            const minterRole = await freshVland.MINTER_ROLE();
            await freshVland.grantRole(minterRole, deployerAddress);
            
            const uri = 'token-1';
            await freshVland.mintLAND(1, deployerAddress, uri);

            const tokenURI = await freshVland.tokenURI(1);
            console.log(`tokenURI`, tokenURI)
            expect(tokenURI).to.equal(`${baseUri}${uri}`);
        });

        it('returns the concatenation of the baseURI with the tokenId if there is no tokenURI', async () => {
            const baseUri = "vaulthill.io/";
            const freshVland = await getNewInitialisedVland(deployerAddress, baseUri);

            const minterRole = await freshVland.MINTER_ROLE();
            await freshVland.grantRole(minterRole, deployerAddress);
            
            const tokenId = 1;
            const uri = '';
            await freshVland.mintLAND(tokenId, deployerAddress, uri);

            const tokenURI = await freshVland.tokenURI(tokenId);
            console.log(`tokenURI`, tokenURI)
            expect(tokenURI).to.equal(`${baseUri}${tokenId}`);
        });
    })
});
