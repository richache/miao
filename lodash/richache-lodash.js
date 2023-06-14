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
    return array.slice(n)
  },

  dropWhile(array, predicate = it => it) {
    let arr = this.filter(array, predicate)
    if (arr) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] !== arr[i]) {
          return array.slice(i)
        }
      }
    } else {
      return array
    }
  },

  dropRight: function (array, n = 1) {
    if (n >= array.length) {
      return []
    }
    while (n > 0) {
      array.pop()
      n--
    }
    return array
  },

  dropRightWhile(array, predicate = it => it) {
    let arr = this.filter(array, predicate)
    if (arr) {
      for (let i = array.length - 1; i >= 0; i--) {
        if (!(arr.includes(array[i]))) {
          return array.slice(0, i + 1)
        }
      }
    }
    return array
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

  sortedIndex: function (array, value) {
    if (array.length == 0) {
      return 0
    }
    let left = 0
    let right = array.length - 1
    while (right - left > 1) {
      let mid = (left + right) >> 1
      if (array[mid] < value) {
        left = mid
      } else {
        right = mid
      }
    }
    if (array[right] >= value) {
      return right
    } else {
      return right + 1
    }
  },

  flatten: function (array) {
    let res = []
    for (let i of array) {
      if (typeof i !== "number") {
        for (let j of i) {
          res.push(j)
        }
      } else {
        res.push(i)
      }
    }
    return res
  },

  flattenDeep: function (array) {
    let res = []
    for (let i of array) {
      if (typeof i !== "number") {
        let deep = this.flattenDeep(i)
        for (let key of deep) {
          res.push(key)
        }
      } else {
        res.push(i)
      }
    }
    return res
  },

  flattenDepth: function (array, depth = 1) {
    for (let i = 0; i < depth; i++) {
      array = this.flatten(array)
    }
    return array
  },

  difference: function (array, ...values) {
    let val = this.flattenDeep(values)
    let res = []
    let map = []
    for (let num of val) {
      if (!map[num]) {
        map[num] = true
      }
    }
    for (let i of array) {
      if (!(i in map)) {
        res.push(i)
      }
    }
    return res
  },

  differenceBy: function (array, ...args) {
    if (Array.isArray(args.at(-1))) {
      return this.difference(array, ...args)
    }
    let iteratee = args.pop()
    let val = this.flatten(args)
    let map = []
    let arr = []
    let res = []
    if (typeof iteratee == "function") {
      val.forEach(element => map.push(iteratee(element)))
      array.forEach(element => arr.push(iteratee(element)))
      let nums = this.difference(arr, map)
      for (let k in arr) {
        for (let j in nums) {
          if (arr[k] == nums[j]) {
            res.push(array[k])
          }
        }
      }
    }

    if (typeof iteratee == "string") {
      val.forEach(element => map.push(element[iteratee]))
      array.forEach(element => arr.push(element[iteratee]))
      let nums = this.difference(arr, map)
      for (let k of array) {
        for (let j in k) {
          for (let n in nums) {
            if (nums[n] == k[j]) {
              res.push(k)
            }
          }
        }
      }
    }

    return res
  },

  differenceWith(array, values, comparator) {
    let res = []
    for (let i in array) {
      let status = false
      for (let j in values) {
        if (comparator(array[i]) == comparator(values[j])) {
          status = true
        }
      }
      if (!status) {
        res.push(array[i])
      }
    }
    return res
  },

  forEach: function (collection, iteratee = it => it) {
    for (let key in collection) {
      iteratee(collection[key], key)
    }
    return collection
  },

  indexOf: function (array, value, fromIndex = 0) {
    if (fromIndex > array.length) {
      return -1
    }
    if (-fromIndex > array.length) {
      fromIndex = 0
    }
    if (fromIndex >= 0) {
      for (let i = fromIndex; i < array.length; i++) {
        if (array[i] == value) {
          return i
        }
      }
    } else {
      for (let i = fromIndex; 0 < array.length + i; i++) {
        if (array[array.length + i] == value) {
          return array.length + i
        }
      }
    }
  },

  head: function (array) {
    return array[0]
  },

  initial: function (array) {
    array.pop()
    return array
  },

  join: function (array, separator = ',') {
    return array.join(separator)
  },

  last: function (array) {
    return array.pop()
  },

  lastIndexOf: function (array, value, fromIndex = array.length - 1) {
    if (fromIndex >= 0) {
      if (fromIndex > array.length) {
        fromIndex = array.length - 1
      }
      for (let i = fromIndex; i > 0; i--) {
        if (array[i] == value) {
          return i
        }
      }
    }
    return -1
  },

  nth: function (array, n = 0) {
    if (Math.abs(n) > array.length) {
      return undefined
    }
    if (n >= 0) {
      return array.at(n)
    } else {
      return array.at(n + array.length)
    }
  },

  pull: function (array, ...values) {
    let res = []
    let map = []
    for (let key of values) {
      if (!(map[key])) {
        map[key] = true
      }
    }
    for (let i of array) {
      if (!(i in map)) {
        res.push(i)
      }
    }
    return res
  },

  pullAll: function (array, ...values) {
    let val = this.flatten(values)
    let res = array
    for (let i = 0; i < val.length; i++) {
      res = this.pull(res, val[i])
    }
    return res
  },

  intersection: function (...arrays) {
    if (arrays.length <= 1) {
      return arrays
    }
    let map = arrays.shift()
    let res = map
    for (let i of arrays) {
      res = same(res, i)
    }
    return res

    function same(arr1, arr2) {
      let res = []
      let map = []
      for (let num of arr2) {
        if (!map[num]) {
          map[num] = true
        }
      }
      for (let i of arr1) {
        if (i in map) {
          res.push(i)
        }
      }
      return res
    }

  },

  identity: function (value) {
    return value
  },

  union: function (...arrays) {
    let val = this.flatten(arrays)
    return Array.from(new Set(val))
  },

  concat: function (...args) {
    return this.flatten(args)
  },

  sortedIndexBy: function (array, value, iteratee = it => it) {
    if (typeof iteratee == "function") {
      for (let i in array) {
        if (iteratee(array[i]) == iteratee(value)) {
          return Number(i)
        }
      }
    }
    if (typeof iteratee == "string") {
      for (let i in array) {
        if (array[i].iteratee == value.iteratee) {
          return Number(i)
        }
      }
    }
  },

  sortedIndexOf: function (array, value) {
    let left = 0
    let right = array.length - 1
    while (right - left > 1) {
      let mid = (left + right) >> 1
      if (array[mid] < value) {
        left = mid
      } else {
        right = mid
      }
    }
    if (array[left] == value) {
      return left
    } else if (array[right] == value) {
      return right
    } else {
      return -1
    }
  },

  sortedLastIndex: function (array, value) {
    for (let i = array.length - 1; i > 0; i--) {
      if (array[i] <= value) {
        return i + 1
      }
    }
  },

  sortedLastIndexOf: function (array, value) {
    for (let i = array.length - 1; i > 0; i--) {
      if (array[i] == value) {
        return i
      }
    }
    return -1
  },

  sortedLastIndexBy(array, value, iteratee = it => it) {
    if (typeof iteratee == "function") {
      for (let i = array.length - 1, j = 0; i >= 0; i--, j++) {
        if (iteratee(array[i]) == iteratee(value)) {
          return j
        }
      }
    }
    if (typeof iteratee == "string") {
      for (let i = array.length - 1, j = 0; i >= 0; i--, j++) {
        if (array[i][iteratee] == value[iteratee]) {
          return j
        }
      }
    }
    return -1
  },

  uniq: function (array) {
    let map = {}
    let res = []
    for (let i of array) {
      if (!map[i]) {
        map[i] = i
        res.push(i)
      }
    }
    return res
  },

  uniqBy: function (array, iteratee = it => it) {
    let res = []
    let map = {}
    if (typeof iteratee == "function") {
      for (let num of array) {
        let val = iteratee(num)
        if (!(val in map)) {
          map[val] = 1
          res.push(num)
        }
      }
      return res
    }

    if (typeof iteratee == "string") {
      for (let num of array) {
        let val = num[iteratee]
        if (!(val in map)) {
          map[val] = 1
          res.push(num)
        }
      }
      return res
    }

  },

  sortedUniq: function (array) {
    let res = []
    if (array.length == 0) {
      return res
    } else if (array.length == 1) {
      return array
    }
    res.push(array[0])
    for (let i = 0, j = 1; i < array.length - 1; i++, j++) {
      while (array[i] == array[j]) {
        i++
        j++
      }
      res.push(array[j])
    }


    if (res.at(-1) == undefined) {
      res.length--
    }

    return res
  },

  sortedUniqBy: function (array, iteratee = it => it) {
    return this.uniqBy(array, iteratee)
  },

  filter: function (collection, predicate = it => it) {
    let res = []
    if (typeof predicate == "function") {
      for (let idx in collection) {
        if (predicate(collection[idx])) {
          res.push(collection[idx])
        }
      }
    }

    if (Array.isArray(predicate)) {
      for (let idx in collection) {
        if (collection[idx][predicate[0]] == predicate[1]) {
          res.push(collection[idx])
        }
      }
    }
    if (typeof predicate == "object") {
      for (let idx in collection) {
        let status = false
        for (let key in predicate) {
          if (collection[idx][key] !== predicate[key]) {
            status = true
          }
        }
        if (!status) {
          res.push(collection[idx])
        }
      }
    }

    if (typeof predicate == "string") {
      for (let idx in collection) {
        if (collection[idx][predicate] == true) {
          res.push(collection[idx])
        }
      }
    }
    return res
  },

  every: function (collection, predicate = it => it) {
    if (typeof predicate == "function") {
      for (let idx in collection) {
        if (!predicate(collection[idx])) {
          return false
        }
      }
      return true
    }
    if (typeof predicate == "boolean") {
      for (let val of collection) {
        if (val !== predicate) {
          return false
        }
      }
      return true
    }
    if (Array.isArray(predicate)) {
      for (let idx in collection) {
        if (collection[idx][predicate[0]] != predicate[1]) {
          return false
        }
      }
      return true
    }
    if (typeof predicate == "object") {
      for (let val of collection) {
        for (let key in val) {
          if (val[key] !== predicate[key]) {
            return false
          }
        }
        return true
      }
    }
    if (typeof predicate == "string") {
      for (let idx in collection) {
        if (collection[idx][predicate] !== true) {
          return false
        }
      }
      return true
    }
  },

  countBy: function (collection, iteratee = it => it) {
    let res = {}
    if (typeof iteratee == "function") {
      for (let val of collection) {
        let newVal = iteratee(val)
        if (!res[newVal]) {
          res[newVal] = 1
        } else {
          res[newVal]++
        }
      }
      return res
    }

    if (typeof iteratee == "string") {
      for (let val of collection) {
        let newVal = val[iteratee]
        if (!res[newVal]) {
          res[newVal] = 1
        } else {
          res[newVal]++
        }
      }
      return res
    }
  },

  without: function (array, ...values) {
    let res = []
    for (let i of array) {
      if (!(values.includes(i))) {
        res.push(i)
      }
    }
    return res
  },

  xor: function (...arrays) {
    let res = []
    let map = {}
    let arr = this.flatten(arrays)
    for (let val of arr) {
      if (!(val in map)) {
        map[val] = 1
      } else {
        map[val]++
      }
    }
    for (let key in map) {
      if (map[key] == 1) {
        res.push(+key)
      }
    }
    return res
  },

  tail: function (array) {
    return array.slice(1)
  },

  take: function (array, n = 1) {
    if (n >= array.length) {
      return array
    }
    if (n <= 0) {
      return []
    }
    return array.slice(0, n)
  },

  takeRight: function (array, n = 1) {
    if (n >= array.length) {
      return array
    }
    if (n <= 0) {
      return []
    }
    return array.slice(-n)
  },

  find: function (collection, predicate = it => it, fromIndex = 0) {
    let array = collection.slice(fromIndex)
    let result = this.filter(array, predicate)
    if (result) {
      return result[0]
    } else {
      return undefined
    }
  },

  findLast: function (collection, predicate = it => it, fromIndex = collection.length - 1) {
    let array = collection.slice(0, fromIndex).reverse()
    let result = this.filter(array, predicate)
    if (result) {
      return result[0]
    } else {
      return undefined
    }
  },

  findIndex(collection, predicate = it => it, fromIndex = 0) {
    let result = this.find(collection, predicate, fromIndex)
    if (result) {
      return this.indexOf(collection, result)
    } else {
      return -1
    }
  },

  findLastIndex(collection, predicate = it => it, fromIndex = collection.length - 1) {
    let array = collection.slice(0, fromIndex + 1).reverse()
    let result = this.find(array, predicate)
    if (result) {
      return this.indexOf(collection, result)
    } else {
      return -1
    }
  },

  groupBy(collection, iteratee = it => it) {
    let res = {}
    if (typeof iteratee == "function") {
      for (let val of collection) {
        let newVal = iteratee(val)
        if (!res[newVal]) {
          res[newVal] = []
          res[newVal].push(val)
        } else {
          res[newVal].push(val)
        }
      }
      return res
    }

    if (typeof iteratee == "string") {
      for (let val of collection) {
        let newVal = val[iteratee]
        if (!res[newVal]) {
          res[newVal] = []
          res[newVal].push(val)
        } else {
          res[newVal].push(val)
        }
      }
      return res
    }
  },

  parseJSON: function (str) {
    var i = 0
    return parseValue()

    function parseValue() {
      let char = str[i]
      if (char == '{') {
        return parseObject()
      }

      if (char == '"') {
        return parseString()
      }

      if (char == '[') {
        return parseArray()
      }

      if (char == 't') {
        let val = str.slice(i, i + 4)
        if (val == 'true') {
          i += 4
          return true
        } else {
          throw error = new SyntaxError(`Unexpected value found at str index ${i} .`)
        }
      }

      if (char == 'f') {
        let val = str.slice(i, i + 5)
        if (val == 'false') {
          i += 5
          return false
        } else {
          throw error = new SyntaxError(`Unexpected value found at str index ${i} .`)
        }
      }

      if (char == 'n') {
        let val = str.slice(i, i + 4)
        if (val == 'null') {
          i += 4
          return null
        } else {
          throw error = new SyntaxError(`Unexpected value found at str index ${i} .`)
        }
      }

      return parseNumber()
    }

    function parseString() {
      i++
      let start = i
      while (str[i] != '"') {
        i++
      }
      let end = i++
      return str.slice(start, end)
    }

    function parseArray() {
      let res = []
      i++
      if (str[i] == ']') {
        i++
        return res
      }

      while (true) {
        let val = parseValue()
        res.push(val)
        if (str[i] == ',') {
          i++
          continue
        }
        if (str[i] == ']') {
          i++
          break
        }
      }
      return res
    }

    function parseObject() {
      let res = {}
      i++
      if (str[i] == '}') {
        i++
        return res
      }

      while (true) {
        let name = parseString()
        i++
        let val = parseValue()
        res[name] = val
        if (str[i] == ',') {
          i++
          continue
        }
        if (str[i] == '}') {
          i++
          break
        }
      }
      return res
    }

    function parseNumber() {
      let start = i
      while (str[i] >= '0' && str[i] <= '9') {
        i++
      }
      return Number(str.slice(start, i))
    }
  },

}
