const axios = require('axios');
const settings = require('../settings.json');
const fs = require('fs-extra');
const path = require('path');
const crypto = require("crypto");

(async () => {

    const toBase64 = (string) => {
        let buff = Buffer.from(string);
        return buff.toString('base64');
    }

    const getFileData = async (url) => {
        const fileData = await fs.readFile(url);

        return {
            path: url,
            data: fs.createReadStream(url),
            stats: fs.statSync(url),
            name: path.basename(url),
            nameWithoutExt: path.basename(url).split('.').slice(0, -1).join('.'),
            md5Hash: crypto.createHash("md5").update(fileData).digest("base64"),
            contentType: 'video/mp4'
        }
    }

    const file = await getFileData(process.argv[2]); // 3rd command line arg should be the filename
    const collectionId = process.argv[3]; // 3rd command line arg should be the filename
    const auth = "Basic " + toBase64(settings.token + ':' + settings.secret);

    const sb_api_url = "https://api.socialbakers.com";

    const config = {
        // proxy: {
        //     host: 'localhost',
        //     port: 8888
        // },
        headers: {
            'Authorization': auth
        }
    };

    console.log('Starting Upload...');

    try {
        const step1 = await axios.post(sb_api_url + '/3/collections/assets', {
            "collectionId": collectionId,
            "assetName": file.name,
            "assetContentType": file.contentType,
            "assetMd5": file.md5Hash
        }, config);

        try {
            const step2 = await axios.put(step1.data.data.assetUploadUrl, file.data, {
                ...config,
                headers: {
                    'Content-Type': file.contentType,
                    'Content-MD5': file.md5Hash,
                    'Content-Length': file.stats.size
                }
            });

            console.log('Success!');

        } catch (err) {
            console.log(err)
        }

    } catch (err) {
        console.log(err)
    }
})();