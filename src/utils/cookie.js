const Cookies = {
  /**
   * 设置cookie
   * @param key cookie名称
   * @param value cookie值
   * @param attributes cookie属性
   * @returns
   */
  set: (key, value, attributes = {}) => {
    if (typeof document === 'undefined') {
      return
    }

    const defaultAttributes = { path: '/' }
    attributes = Object.assign(attributes, defaultAttributes)

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString()
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, '')

    let stringifiedAttributes = ''
    for (const attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += `; ${attributeName}`

      if (attributes[attributeName] === true) {
        continue
      }

      stringifiedAttributes += `=${attributes[attributeName].split(';')[0]}`
    }

    return (document.cookie = `${key}=${value}${stringifiedAttributes}`)
  },
  /**
   * 获取cookie
   * @param key cookie名称
   * @returns
   */
  get: (key) => {
    if (typeof document === 'undefined' || !key) {
      return
    }
    const cookieStr = document.cookie ? document.cookie.split('; ') : []

    const result = {}
    for (let i = 0; i < cookieStr.length; i++) {
      const parts = cookieStr[i].split('=')
      const value = parts.slice(1).join('=')

      try {
        const foundKey = decodeURIComponent(parts[0])
        result[foundKey] = value

        if (key === foundKey) {
          break
        }
      } catch (e) {
        console.log(e)
      }
    }

    return key ? result[key] : undefined
  },
  /**
   * 删除cookie
   * @param key 要删除的cookie名称
   */
  remove: (key) => {
    Cookies.set(key, '', { expires: -1 })
  },
}

/**
 * 设置cookie
 * @param key cookie名称
 * @param value cookie值
 * @param attrs cookie属性
 */
export const setCookie = (key, value, attrs = {}) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  Cookies.set(key, value, { ...attrs })
}

/**
 * 根据cookie名称获取值
 * @param key cookie名称
 * @returns
 */
export const getCookie = (key) => {
  const data = Cookies.get(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

/**
 * 根据名称删除cookie值
 * @param key cookie名称
 */
export const removeCookie = (key) => {
  Cookies.remove(key)
}
