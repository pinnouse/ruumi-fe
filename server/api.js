const axios = require('axios')

const api = axios.create({
    baseURL: process.env.API_URL || "http://localhost:8000/",
    headers: {
        'Authorization': process.env.API_AUTH || 'your_auth_key'
    }
})

const PATHS = [
    'search',
    'random',
    'anime',
    'episode',
]

module.exports = async (req, res) => {
    let path = req.params.item
    if (PATHS.includes(path)) {
        try {
            //TODO: API Caching
            let response
            if (req.method === 'GET') {
                response = await api.get(path, {
                    params: req.query
                })
                if (response.status === 200) res.send(response.data)
            } else if (req.method === 'POST') {
                response = await api.post(path, {
                    data: req.body
                })
                if (response.status === 200) res.send(response.data)
            }
        } catch(e) {
            if (e.response) res.status(e.response.status).send(e.response.data)
            else res.status(500).send('failed')
        }
        return
    }
    res.status(403).send("Not authorized to access this resource")
}