var richache = {
  chunk: function (array, size = 1) {
    let res = []
    for (let i = 0, j = 0; i < array.length; i += size, j++) {
      res[j] = array.slice(i, i + size)
    }
    return res
  },

  reverse: function (array) {
    return array.reverse()
  },

  compact: function (array) {
    let res = []
    for (let i of array) {
      if (i) {
        res.push(i)
      }
    }
    return res
  },

  drop: function (array, n = 1) {
    if (n >= array.length) {
      return []
    }
    return array.slice(array[n - 1])
  },

  fill: function (array, value, start = 0, end = array.length) {
    for (let i = 0; i < end; i++) {
      if (i >= start) {
        array.splice(i, 1, value)
      }
    }
    return array
  },

  fromPairs: function (pairs) {
    let res = {}
    for (let i = 0; i < pairs.length; i++) {
      let key = pairs[i][0]
      res[key] = pairs[i][1]
    }
    return res
  },

  toPairs: function (object) {
    let arr = []
    let obj = Object.keys(object)
    for (let i = 0; i < obj.length; i++) {
      let key = obj[i]
      arr[i] = []
      arr[i][0] = key
      arr[i][1] = (object[key])
    }
    return arr
  },
}
