const Cors = require('cors')
const axios = require('axios')
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
    const turl = req.body.turl
      // 4

    const response = await axios.request({
        responseType: 'arraybuffer',
        followAllRedirects: true,
        url: turl+'.flac',
        method: 'get',
      }).then((result) => {
        return result;
      })
        .catch(err => console.log("err"));
      return res.send(response.data);
    
  }
}
