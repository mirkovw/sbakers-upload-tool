const axios = require('axios');
const settings = require('../settings.json');
const fs = require('fs-extra');
const path = require('path');
const FormData = require('form-data');

(async () => {

    const getFileData = (url) => {
        return {
            path: url,
            data: fs.createReadStream(url),
            size: fs.statSync(url),
            name: path.basename(url),
            nameWithoutExt: path.basename(url).split('.').slice(0, -1).join('.')
        }
    }

    const file = getFileData(process.argv[2]); // 3rd command line arg should be the filename
    const collectionId = process.argv[3]; // 3rd command line arg should be the filename
    const sb_api_url = "https://api.socialbakers.com";

    let buff = Buffer.from(settings.token + ':' + settings.secret);
    const auth = "Basic " + buff.toString('base64');

    const config = {
        proxy: {
            host: 'localhost',
            port: 8888
        },
        headers: {
            'Authorization': auth
        }
    };

    try {
        const res = await axios.get(sb_api_url + '/3/collections', config);
        console.log(res.data);
    } catch (err) {
        console.log(err)
    }

})();