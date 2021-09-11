const Cors = require('cors')
const axios = require('axios')
import aesjs from '../../utils/aes-js.js';
import * as deezerDecoder from '../../utils/dz.js'
import { saveAs } from '../../utils/fs.js'
import { hex_md5 } from '../../utils/md5.js'

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}
export default async (req, res) => {
  await runMiddleware(req, res, cors)
  if (req.method === 'POST') {
    const arl = req.body.arl
    const track = req.body['track']


    // get track page data
    const urlCryptor = new aesjs.ModeOfOperation.ecb(aesjs.utils.utf8.toBytes('jo6aey6haid2Teih')),
        hex2bin = function(h) {
            return aesjs.utils.hex.fromBytes(h);
        },
        bin2hex = function(b) {
            return aesjs.utils.hex.fromBytes(b);
        },
        bin2str = function(b) {
            return b.map(c => String.fromCharCode(c)).join('');
        }, //aesjs.util.convertStringToBytes(b);
        str2bin = function(s) {

            return s.split('').map(c => c.charCodeAt(0));
        }, //aesjs.util.convertStringToBytes(s));
        aesBS = 16,
        zeroPad = function(b) {
            let l = b.length;
            if (l % aesBS !== 0) {
                if (typeof(b) === 'string') b += '\0'.repeat(aesBS - (l % aesBS));
                else b = b.concat(Array.apply(null, Array(aesBS - (l % aesBS))).map(() => 0));
            }
            return b;
        },
        zeroUnpad = (s => s.replace(/\0+$/, '')),
        urlsep = '\xa4';

    let bfGK = 'g4el58wc0zvf9na1';

    function bfGenKey2(h1, h2) {
        let l = h1.length,
            s = [];
        for (var i = 0; i < l; i++) s.push(bfGK.charCodeAt(i) ^ h1.charCodeAt(i) ^ h2.charCodeAt(i));
        return s;
    }

    function bfGenKey(id, format) {
        let h = hex_md5(id + ''),
            h1 = h.substr(0, 16),
            h2 = h.substr(16, 16),
            k = bfGenKey2(h1, h2);
        return k.map(format == 'hex' ? (a => (a + 256).toString(16).substr(-2)) : (a => String.fromCharCode(a))).join('');
    }

    function blobencry(url, songId, artn, title) {
        e.preventDefault()
        fetch('/api/file', {
                method: 'POST',
                body: JSON.stringify({
                    turl: url + '.flac'
                }),
            })
            .then((res) => res.arrayBuffer())
            .then((userData) => {
                var decoded = deezerDecoder(userData, songId);
                const blob = new Blob([decoded], {
                    type: 'audio/mpeg'
                });
                saveAs(blob, artn + " - " + title + ".mp3");
            })

    }
    var myHeaders = new Headers({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:69.0) Gecko/20100101 Firefox/69.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0',
        'TE': 'Trailers',
        'Cookie': 'arl=' + arl
    });
    const response = await fetch(track, {
        headers: myHeaders
    })
    const htmlString = await response.text()
    var regex = new RegExp(/<script>window\.__DZR_APP_STATE__ = (.*)<\/script>/g);
    var rexec = regex.exec(htmlString);
    var _data = rexec[1];
    var obj = JSON.parse(_data);
    // var decy = decryptTrack("name.flac",getDownloadUrl(obj['DATA']['MD5_ORIGIN'], obj['DATA']["SNG_ID"], 9, obj['DATA']['MEDIA_VERSION']), obj['DATA']["SNG_ID"]);
    var urlPart = obj['DATA']['MD5_ORIGIN'] + '\xa4' + 9 + "\xa4" + obj['DATA']["SNG_ID"] + "\xa4" + obj['DATA']['MEDIA_VERSION'];

    let str = [obj['DATA']['MD5_ORIGIN'], 9, obj['DATA']['SNG_ID'], obj['DATA']['MEDIA_VERSION']].join(urlsep);

    str = zeroPad([hex_md5(str), str, ''].join(urlsep));
    var encURL = "https://e-cdns-proxy-" + obj['DATA']['MD5_ORIGIN'].substring(0, 1) + ".dzcdn.net/mobile/1/" + bin2hex(urlCryptor.encrypt(str2bin(str)));

    var bfkey = bfGenKey(obj['DATA']['SNG_ID'], 9);
    //var blob = blobencry(encURL, obj['DATA']['SNG_ID'], obj['DATA']['ART_NAME'], obj['DATA']['SNG_TITLE']);
    // get track arraybuffer
    console.log(encURL+".flac");
    const bufferresponse = await axios.request({
        responseType: 'arraybuffer',
        followAllRedirects: true,
        url: encURL+".flac",
        method: 'get',
      }).then((result) => {
        return result;
      })
        .catch(err => console.log(err));
      // return res.send({ buffer: bufferresponse.data, songID: obj['DATA']['SNG_ID'], artn: obj['DATA']['ART_NAME'], title: obj['DATA']['SNG_TITLE']});
      var decoded = deezerDecoder(bufferresponse.data, obj['DATA']['SNG_ID']);
      return res.send(decoded);
    
  }
}
