var richache = {
  // 迭代函数，创建一个函数，根据传入的形参判断，如果返回值为true，返回回调函数或者值，否则返回false
  // 通过这个过程把这个函数塑造为迭代器
  // iteratee（迭代函数）生成后，使用方法为: 传入调用者的3个参数：(value, index|key, collection).
  iteratee: function (predicate = this.identity) {
    let func = predicate
    if (Array.isArray(predicate)) {
      func = this.matchesProperty(predicate)
    } else if (typeof predicate == "object") {
      func = this.matches(predicate)
    } else if (typeof predicate == "string") {
      func = this.property(predicate)
    }
    return func
  },

  // filter: function (collection, predicate = this.identity) {
  //   let res = []
  //   if (typeof predicate == "function") {//
  //     for (let item of collection) {
  //       if (predicate(item)) {
  //         res.push(item)
  //       }
  //     }
  //   } else if (Array.isArray(predicate)) {
  //     for (let item of collection) {
  //       if (item[predicate[0]] == predicate[1]) {
  //         res.push(item)
  //       }
  //     }
  //   } else if (typeof predicate == "object") {
  //     for (let item of collection) {
  //       let status = false
  //       for (let key in predicate) {
  //         if (item[key] !== predicate[key]) {
  //           status = true
  //         }
  //       }
  //       if (!status) {
  //         res.push(item)
  //       }
  //     }
  //   } else if (typeof predicate == "string") {
  //     for (let item of collection) {
  //       if (item[predicate] == true) {
  //         res.push(item)
  //       }
  //     }
  //   }
  //   return res
  // },
  // 亦可写成以下形式：
  // 默认predicate返回一个函数，基于传入的predicate类型，此函数有不同的返回值
  filter: function (array, predicate) {
    let func = predicate
    if (typeof predicate === 'string') {//类型为字符串
      func = function (it) {
        return it[predicate]
      }
    } else if (Array.isArray(predicate)) {//类型为数组
      func = function (it) {
        return it[predicate[0]] === predicate[1]
      }
    } else if (typeof predicate === 'object') {//类型为对象
      func = function (it) {
        for (let key in predicate) {
          if (it[key] !== predicate[key]) {
            return false
          }
        }
        return true
      }
    }
    // 默认predicate为函数时的返回值
    let result = []
    for (let item of array) {
      if (func(item)) {
        result.push(item)
      }
    }
    return result
  },

  // 创建一个数组，存储迭代函数遍历collection后返回的结果
  map: function (array, predicate) {
    let func = this.iteratee(predicate)
    let res = []
    for (let key in array) {
      res.push(func(array[key], key, array))
      // iteratee（迭代函数）调用3个参数：(value, index|key, collection).
      // 即使传入的array是一个非数组对象，只要它有key和value（可枚举）,map亦可正常运作
    }
    return res
  },

  // reduce 每一轮的迭代结果是下一轮的初始值，迭代结束返回一个值
  reduce: function (collection, it = this.identity, accumulator = 0) {
    let func = this.iteratee(it)
    let res = accumulator
    for (let key in collection) {
      res = func(res, collection[key], key)
      // iteratee（迭代函数）调用4个参数：(accumulator=collection[0], value, index|key ,collection).
      // collection只用于枚举，不参与结果赋值
      // 即使传入的collection是一个非数组对象，只要它有key和value（可枚举）,reduce亦可正常运作
    }
    return res
  },

  // reduce的倒序迭代
  reduceRight: function (collection, it = this.identity, accumulator = 0) {
    let func = this.iteratee(it)
    let res = accumulator
    for (let key = collection.length - 1; key > -1; key--) {
      res = func(res, collection[key], key)
    }
    return res
  },

  // 返回函数在指定path下的值
  property: function (path) {
    return function (obj) {
      return obj[path]
      //return get(obj,path)
    }
  },

  // 深度对比对象在path属性下的值是否与src的值相同
  matchesProperty: function (path, srcValue) {
    return function (object) {
      return richache.isMatch(object[path], srcValue)
    }
  },

  // 判断传入的两个对象内容是否相同（深度对比）
  // 如果元素里面还有对象，继续递归对称比，只有递归的每一层的相同，才会进入else
  isMatch: function (object, src) {

    // 如果考虑object和src传入的都是数字，则直接对比object和src
    if (typeof object === 'number' && typeof src === 'number') {
      return object === src
    }

    for (let key in src) {
      if (typeof src[key] === 'object') {
        if (!richache.isMatch(object[key], src[key])) {
          return false
        }
      } else {
        if (object[key] !== src[key]) {
          return false
        }
      }
    }
    return true
  },

  //绑定第一个参数时的isMatch深度对比
  matches: function (source) {
    return function (obj) {
      return richache.isMatch(obj, source)
    }
  },

  // 带跳过功能的函数绑定
  bind: function (fn, thisArgs, ...fixedArgs) {
    return function (...args) {
      let copy = fixedArgs.slice()
      let i = 0, j = 0
      for (; i < copy.length; i++) {
        if (copy[i] == undefined) {
          copy[i] = args[j++]
        }
      }
      while (j < args.length) {
        copy.push(args[j++])
      }
      return fn.call(thisArgs, ...copy)
    }
    //_bind.placeholder = undefined 占位符，可改
    //使用时传入第一个参数是原函数，第二参数是this（不指定时填null），剩余参数是原函数的形参（第几个形参填啥就绑定啥），如不绑定可用占位符
  },

  //仅传入一个参数
  unary: function (func) {
    return function (...args) {
      return func(...args.slice(0, 1))
    }
  },

  // 仅传入前n个参数
  ary: function (func, n = func.length) {
    return function (...args) {
      return func(...args.slice(0, n))
    }
  },

  // 反转传入参数
  flip: function (func) {
    return function (...args) {
      return fucn(...args.reverse())
    }
  },

  // 实现...args, 剩余参数折叠
  rest: function (func, start = func.length - 1) {
    return function () {
      let args = Array.from(arguments)
      let normalArgs = args.slice(0, start)
      let resArgs = args.slice(start)
      normalArgs.push(resArgs)
      return func.apply(this, normalArgs)
    }
  },

  spread: function (func) {
    return function (array) {
      return func.apply(this, array)
    }
  },

  // 记忆函数(使用Map()建立cache映射)
  // memoize: function (func) {
  //   let cache = new Map()
  //   return function (arg) {
  //     if (cache.has(arg)) {
  //       return cache.get(arg)
  //     } else {
  //       let res = func(arg)
  //       cache.set(arg, res)
  //       return res
  //     }
  //   }
  // },
  // 缓存是一种有时限的映射
  memoize: function (func, recive = this.identity) {
    let cache = new Map()
    return function (...args) {
      let cacheKey = recive(...args)
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)
      } else {
        let res = func.call(this, ...args)
        cache.set(cacheKey, res)
        return res
      }
    }
  },
  // memoize.Cache = Map

  sum: function (array) {
    return array.reduce((a, b) => a + b)
  },

  sumBy: function (array, iterator = this.identity) {
    let res = 0
    //如果迭代器是字符串
    if (typeof iterator === "string") {
      for (let n in array) {
        res += array[n][iterator]
      }
    } else {//如果迭代器是函数
      for (let i in array) {
        res += iterator(array[i])
      }
    }
    return res
  },

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

  dropWhile(array, predicate = this.identity) {
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

  dropRightWhile(array, predicate = this.identity) {
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

  // differenceWith(array, values, comparator) {
  //   let res = []
  //   for (let i in array) {
  //     let status = false
  //     for (let j in values) {
  //       if (comparator(array[i]) == comparator(values[j])) {
  //         status = true
  //       }
  //     }
  //     if (!status) {
  //       res.push(array[i])
  //     }
  //   }
  //   return res
  // },

  // 调用迭代函数判断传入的第二个参数（生成迭代器func），然后在循环中使用回调函数(func)计算结果，最后返回一个按序遍历的结果数组
  // map得到的数组长度小于等于原数组（对象），这取决于迭代器对原数组进行了什么计算（若迭代结果false则无返回）
  forEach: function (collection, it = this.identity) {
    let func = this.iteratee(it)
    for (let key in collection) {
      func(collection[key], key, collection)
      //此处迭代器调用3个参数：(value, index|key, collection).
    }
    return func
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

  sortedIndexBy: function (array, value, iteratee = this.identity) {
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

  sortedLastIndexBy(array, value, iteratee = this.identity) {
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

  uniqBy: function (array, iteratee = this.identity) {
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

  uniqWith: function (array, comparator) {
    let res = []
    for (let item of array) {
      let keep = true
      for (let seen of res) {
        if (comparator(item, seen)) {
          keep = false
        }
      }
      if (keep) {
        res.push(item)
      }
    }
    return res
  },

  // 深克隆
  // cloneDeep: function (obj) {
  //   if (typeof obj == 'object') {
  //     if (cloneMap.has(obj)) {
  //       return cloneMap.get(obj)
  //     }
  //   }
  //   let copy = {}
  //   cloneMap.set(obj, copy)
  //   for (let key in obj) {
  //     if (obj.hasOwnProperty(key)) {
  //       copy[key] = this.cloneDeep(obj[key], cloneMap)
  //     }
  //   }
  //   return copy
  // },

  // 有序集合的去重，单次扫描即可完成
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

  // 返回一个不重复的数组;几乎等同于uniqBy，但对有序数组效率更高
  // 使用数组存储字典的方法（类似map映射）
  sortedUniqBy: function (array, iterator = this.identity) {
    if (array.length == 0) {
      return []
    }
    let res = [array[0]]
    let seenKey = [iterator(array[0])]
    for (let i = 0; i < array.length; i++) {
      let key = iterator(array[i])
      if (key !== seenKey.at(-1)) {
        res.push(array[i])
        seenKey.push(key)
      }
    }
    return res

    //或者 return this.uniqBy(array, iteratee)
  },

  every: function (collection, predicate = this.identity) {
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

  countBy: function (collection, iteratee = this.identity) {
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

  find: function (collection, predicate = this.identity, fromIndex = 0) {
    let array = collection.slice(fromIndex)
    let result = this.filter(array, predicate)
    if (result) {
      return result[0]
    } else {
      return undefined
    }
  },

  findLast: function (collection, predicate = this.identity, fromIndex = collection.length - 1) {
    let array = collection.slice(0, fromIndex).reverse()
    let result = this.filter(array, predicate)
    if (result) {
      return result[0]
    } else {
      return undefined
    }
  },

  findIndex(collection, predicate = this.identity, fromIndex = 0) {
    let result = this.find(collection, predicate, fromIndex)
    if (result) {
      return this.indexOf(collection, result)
    } else {
      return -1
    }
  },

  findLastIndex(collection, predicate = this.identity, fromIndex = collection.length - 1) {
    let array = collection.slice(0, fromIndex + 1).reverse()
    let result = this.find(array, predicate)
    if (result) {
      return this.indexOf(collection, result)
    } else {
      return -1
    }
  },

  groupBy(collection, iteratee = this.identity) {
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
