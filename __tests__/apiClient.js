const superagent = require('superagent')

class ApiClient {
  constructor(port) {
    this.apiUrl = `localhost:${port}`
    this.token = null
  }

  useToken(token) {
    this.token = token
  }

  async postRegister(payload) {
    const res = await superagent.post(`${this.apiUrl}/register`).send(payload)

    return res
  }

  async postLogin(payload) {
    const res = await superagent.post(`${this.apiUrl}/login`).send(payload)

    return res
  }

  async getUser() {
    const res = await superagent
      .get(`${this.apiUrl}/user`)
      .set('Authorization', `Bearer ${this.token}`)

    return res
  }

  async postUser(payload) {
    const res = await superagent
      .post(`${this.apiUrl}/user`)
      .set('Authorization', `Bearer ${this.token}`)
      .send(payload)

    return res
  }
}

module.exports = { ApiClient }
