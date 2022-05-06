export default new class {
  set(key: string, payload: any, expire: number = 0) {
    const data = { data: payload, expire: expire * 1000 + Date.now() }
    localStorage.setItem(key, JSON.stringify(data))
  }

  get(key: string) {
    const data = JSON.parse(localStorage.getItem(key)!) || {}
    if (data.expire) {
      if (data.expire < Date.now()) {
        this.remove(key)
        return null
      }
      return data.data
    }
    return data.data
  }

  remove(key: string) {
    localStorage.removeItem(key)
  }
}