
const { assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../herlper-hardhat-config")


!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT Unit Tests", function () {
          let basicNft, deployer

          beforeEach(async () => {
              await deployments.fixture(["basicnft"])
              deployer = (await getNamedAccounts()).deployer
              basicNft = await ethers.getContract("BasicNft")
          })
        
        describe("Constructor", () => {
            it("Initializes the NFT Correctly.", async () => {
                const name = await basicNft.name()
                const symbol = await basicNft.symbol()
                const tokenCounter=await basicNft.getTokenCounter()
                assert.equal(name, "Dog")
                assert.equal(symbol, "DOG")
                assert.equal(tokenCounter.toString(),"0")
            })
        })
        describe("Mint NFT", () => {
          beforeEach(async () => {
              const txResponse = await basicNft.mintNft()
              await txResponse.wait(1)
          })
          it("Allows users to mint an NFT, and updates appropriately", async function () {
              const tokenURI = await basicNft.tokenURI(0)
              const tokenCounter = await basicNft.getTokenCounter()

              assert.equal(tokenCounter.toString(), "1")
              assert.equal(tokenURI, await basicNft.TOKEN_URI())
          })
          it("Show the correct balance and owner of an NFT", async function () {
              const deployerBalance = await basicNft.balanceOf(deployer)
              const owner = await basicNft.ownerOf("0")

              assert.equal(deployerBalance.toString(), "1")
              assert.equal(owner, deployer)
          })
        })
    })