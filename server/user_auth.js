const axios = require('axios')
const qs = require('querystring')

const DISC_API = axios.create({
    baseURL: 'https://discordapp.com/api/v6/',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

module.exports = {
    async login(code) {
        try {
            const TOKEN = await DISC_API({
                url: 'oauth2/token',
                method: 'POST',
                data: qs.stringify({
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: process.env.REDIRECT_URI || 'https://ruumi.net/auth',
                    scope: 'identify email'
                })
            })
            if (TOKEN.status === 200 && TOKEN.data) return TOKEN.data
        } catch(e) {
            console.log(e)
            if (e.error) return e.error
        }
        return {}
    },
    async refresh(refresh_token) {
        try {
            const TOKEN = await DISC_API({
                url: 'oauth2/token',
                method: 'POST',
                data: qs.stringify({
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: refresh_token,
                    redirect_uri: process.env.REDIRECT_URI || 'https://ruumi.net/auth',
                    scope: 'identify email'
                })
            })
            if (TOKEN.status === 200 && TOKEN.data) return TOKEN.data
        } catch(e) {
            console.log(e)
            if (e.error) return e.error
        }
        return {}
    },
    async getUser(access) {
        try {
            const RESPONSE = await DISC_API({
                url: 'users/@me',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            })
            if (RESPONSE.status == 200 && RESPONSE.data) return RESPONSE.data
        } catch(e) {
            if (e.error) return e.error
        }
        return {}
    }
}