const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()
const pinataApiKey = process.env.Pinata_API_KEY
const pinataApiSecret = process.env.Pinata_API_SECRET
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath)
    const files = fs.readdirSync(fullImagesPath)
    let responses = []
    console.log("Uploading to Pinata...")
    for (fileIndex in files) {
        const readableStreamForFile = fs.createReadStream(
            `${fullImagesPath}/${files[fileIndex]}`
        )
        const options = {
            pinataMetadata: {
                name: files[fileIndex],
            },
        }
        try {
            await pinata
                .pinFileToIPFS(readableStreamForFile, options)
                .then((result) => {
                    responses.push(result)
                })
        } catch (error) {
            console.log(error)
        }
    }

    return { responses, files }
}

module.exports = { storeImages }
