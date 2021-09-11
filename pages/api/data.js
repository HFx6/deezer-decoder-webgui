const Cors = require('cors')

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
    const track = req.body.track

    
      // 4
      var myHeaders = new Headers({
        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:69.0) Gecko/20100101 Firefox/69.0',
        'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language' : 'en-US,en;q=0.5',
        'Connection' : 'keep-alive',
        'Upgrade-Insecure-Requests' : '1',
        'Cache-Control' : 'max-age=0',
        'TE' : 'Trailers',
        'Cookie': 'arl='+arl
      });
      const response = await fetch(track, {
        headers: myHeaders
      })
      const htmlString = await response.text()

      return res.json({
        htmlString
      })
    
  }
}
