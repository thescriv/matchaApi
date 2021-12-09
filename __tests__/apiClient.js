const superagent = require('superagent')

class apiClient {
  constructor(port) {
    this.apiUrl = `localhost:${port}`
  }

  async postRegister(payload) {
    const res = await superagent.post(`${this.apiUrl}/register`).send(payload)

    return res
  }

  async postLogin(payload) {
    const res = await superagent.post(`${this.apiUrl}/login`).send(payload)

    return res
  }
}

module.exports = { apiClient }
