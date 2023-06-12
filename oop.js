
class MyMap {
  constructor() {
    this._keys = []
    this._vals = []
  }

  // 设置key的映射目标，如果不存在，增加一组映射，如果存在则修改obj[key]=val
  // 可以不返回，也可以设计成返回有用的东西（返回对象本身以便链式调用）
  set(key, val) {
    let keyIdx = this._keys.indexOf(key)
    if (keyIdx >= 0) {
      this._vals[keyIdx] = val
    } else {
      this._keys.push(key)
      this._vals.push(val)
    }
    return this
  }
  // 获取key的映射目标obj[key]
  get(key) {
    let keyIdx = this._keys.indexOf(key)
    if (keyIdx >= 0) {
      return this._vals[keyIdx]
    }
  }
  //判断是否存在key这个映射，key in obj
  has(key) {
    if (this._keys.includes(key)) {
      return true
    } else {
      return false
    }
  }
  // 删除key及key的映射 delete obj[key]
  // 返回是否删除成功
  delete(key) {
    let keyIdx = this._keys.indexOf(key)
    if (keyIdx >= 0) {
      this._keys.splice(keyIdx, 1)
      this._vals.splice(keyIdx, 1)
      return true
    } else {
      return false
    }
  }

  get size() {
    return this._keys.length
  }

}

class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  plus(vector) {
    let x = this.x + vector.x
    let y = this.y + vector.y
    return new Vector(x, y)
  }

  minus(vector) {
    let x = this.x - vector.x
    let y = this.y - vector.y
    return new Vector(x, y)
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
}

class Complex {
  constructor(real, imag) {
    this.real = real
    this.imag = imag
  }
  plus(c) {
    let real = this.real + c.real
    let imag = this.imag + c.imag
    return new Complex(real, imag)
  }
  minus(c) {
    let real = this.real - c.real
    let imag = this.imag - c.imag
    return new Complex(real, imag)
  }
  mul(c) {
    let real = this.real * c.real - this.imag * c.imag
    let imag = this.real * c.imag + this.imag * c.real
    return new Complex(real, imag)
  }
  div(c) {
    let helper = new Complex(c.real, - c.imag)
    let up = this.mul(helper)
    let down = c.mul(helper)
    let real = up.real / down.real
    let imag = up.imag / down.real
    return new Complex(real, imag)
  }
}

class LinkedList {
  constructor(...initVals) {
    this.head = null
    this.tail = null

    for (let item of initVals) {
      this.append(item)
    }
  }

  // 往链表的末尾增加一个元素
  append(val) {
    var node = {
      val, next: null
    }
    if (this.head == null) {
      this.head = this.tail = node
      return
    } else {
      this.tail.next = node
      this.tail = node
      return
    }
  }
  //往链表的头部增加一个元素
  prepend(val) {
    var node = {
      val, next: null
    }
    if (this.head == null) {
      this.head = this.tail = node
      return
    } else {
      node.next = this.head
      this.head = node
      return
    }
  }
  // 返回链表的第idx个元素
  at(idx) {
    let p = this.head
    let count = 0
    while (count < idx) {
      p = p.next
      count++
    }
    return p.val
  }


  get size() {
    let p = this.head
    let l = 0
    while (p) {
      l++
      p = p.next
    }
    return l
  }
}

class Queue {
  /** 表示一个队列
    * 单向链表实现
    * 尾进头出
    */
  constructor() {
    this.head = null
    this.tail = null
    this.nodeCount = 0
  }
  // 将一个元素添到队列中
  add(val) {
    let node = {
      val, next: null
    }
    if (this.tail) {
      this.tail.next = node
      this.tail = node
    } else {
      this.head = this.tail = node
    }
    this.nodeCount++
  }

  // 从队列中取出一个元素，先添加的是先被取出的
  // 队列为空时返回undefined
  pop() {
    if (this.head == null) {//没有节点时
      return
    }
    this.nodeCount--
    if (this.head == this.tail) {//只有一个节点时
      let result = this.head.val
      this.head = this.tail = null
      return result
    }

    // 一般情况
    let result = this.head.val
    this.head = this.head.next
    return result
  }

  // 返回队列的长度
  // Queue.prototype.size = function () {
  //   return this.nodeCount
  // }

  get size() {
    return this.nodeCount
  }
}

class Stack {
  constructor() {
    this.head = null
    this.nodeCount = 0
  }

  push(val) {
    let node = {
      val, next: null
    }
    if (this.head == null) {
      this.head = node
    } else {
      node.next = this.head
      this.head = node
    }
    this.nodeCount++
  }
  pop() {
    if (this.head == null) {
      return undefined
    }
    this.nodeCount--
    let result = this.head.val
    this.head = this.head.next
    return result
  }

  // Stack.prototype.size = function () {
  //   return this.nodeCount
  // }
  get size() {
    return this.nodeCount
  }
}

class MySet {
  constructor() {
    this._elements = []
  }
  add(val) {
    if (!this.has(val)) {
      this._elements.push(val)
    }
  }

  delete(val) {
    if (this.has(val)) {
      let idx = this._elements.indexOf(val)
      this._elements.splice(idx, 1)
      return true
    } else {
      return false
    }
  }

  has(val) {// boolean
    return this._elements.includes(val)
  }

  // Set.prototype.size = function () {// number
  //   return this._elements.length
  // }

  get size() {
    return this._elements.length
  }
}

// class ArrayList {
//   constructor() {
//     this._vals = new Array(16)
//     this.count = 0
//   }

//   push(val) {
//     this._vals[this.count] = val
//     this.count++
//     return this.count
//   }

//   pop() {
//     if (this.count == 0) {
//       return
//     } else {
//       let result = this._vals[this.count - 1]
//       this._vals[this.count - 1] = null
//       this.count--
//       return result
//     }
//   }

//   shift() {
//     if (this.count == 0) {
//       return
//     } else {
//       let result = this._vals[0]
//       let i = 0
//       for (; i < this.count; i++) {
//         this._vals[i - 1] = this._vals[i]
//       }
//       this._vals[i - 1] = null
//     }
//     this.count--
//     return result
//   }

//   unshift(val) {
//     for (let i = this.count - 1; i >= 0; i--) {
//       this._vals[i + 1] = this._vals[i]
//     }
//     this._vals[0] = val
//     this.count++
//     return this
//   }
//   at(idx) {
//     if (idx < this.count && -idx <= this.count) {
//       if (idx < 0) {
//         idx = idx + this.count
//       }
//       return this._vals[idx]
//     } else {
//       return undefined
//     }
//   }
//   find(f) {
//     for (let i = 0; i < this.count; i++) {
//       if (f(this._vals[i])) {
//         return this._vals[i]
//       }
//     }
//   }
//   findIdx(f) {
//     for (let i = 0; i < this.count; i++) {
//       if (f(this._vals[i])) {
//         return i
//       }
//     }
//     return -1
//   }

//   get length() {
//     return this.count
//   }

//   set length(l) {
//     if (l < this.count) {//删除l之后元素
//       for (let i = l; i < this.count; i++) {
//         this._vals[i] = null
//       }
//       this.count = l
//       return
//     }

//     if (l > this.count) {//扩容
//       let oldVals = this._vals
//       this._vals = new Array(this.count * 2)
//       for (let i = 0; i < oldVals.length; i++) {
//         this._vals[i] = oldVals[i]
//       }
//       this.count = l
//       return
//     }
//   }

// }

class PriorityQueue {
  constructor(initials = [], predicate = it => it) {
    if (typeof predicate !== "function") {
      throw new TypeError("predicate is not a function,got: predicate")
    }
    this.array = []
    this.predicate = predicate
    for (let item of initials) {
      this.push(item)
    }
  }
  // 删除堆中的一个元素并维护堆的性质（完全二叉树，顺序排列）
  pop() {
    if (this.array.length == 0) {
      return undefined
    }
    if (this.array.length == 1) {
      return this.array.pop()
    }
    let result = this.array[0]
    let last = this.array.pop()
    this.array[0] = last
    this.heapDown(0)
    return result
  }

  // 从pos位置开始往下调整
  // pos位置的左右子树都是合法的堆
  heapDown2(pos) {//递归版
    let leftPos = 2 * pos + 1
    let rightPos = 2 * pos + 2
    let maxIdx = pos
    if (leftPos < this.array.length && this.predicate(this.array[leftPos]) > this.predicate(this.array[maxIdx])) {
      maxIdx = leftPos
    }
    if (rightPos < this.array.length && this.predicate(this.array[rightPos]) > this.predicate(this.array[maxIdx])) {
      maxIdx = rightPos
    }
    if (maxIdx !== pos) {
      this.swap(maxIdx, pos)
      this.heapDown2(maxIdx)
    }
  }
  heapDown(pos) {//循环版
    for (; ;) {
      let leftPos = 2 * pos + 1
      let rightPos = 2 * pos + 2
      let maxIdx = pos
      if (leftPos < this.array.length && this.predicate(this.array[leftPos]) > this.predicate(this.array[maxIdx])) {
        maxIdx = leftPos
      }
      if (rightPos < this.array.length && this.predicate(this.array[rightPos]) > this.predicate(this.array[maxIdx])) {
        maxIdx = rightPos
      }
      if (maxIdx !== pos) {
        this.swap(maxIdx, pos)
        pos = maxIdx
      } else {
        break
      }
    }
  }

  // 往堆里增加一个元素并维护堆的性质
  push(val) {
    this.array.push(val)
    this.heapUp(this.array.length - 1)
    return this
  }

  // 从pos位置开始往上调整
  heapUp2(pos) { // 递归版
    if (pos == 0) {
      return
    }
    let parentPos = (pos - 1) >> 1 //计算pos位置的元素的父节点的位置
    if (this.predicate(this.array[pos]) > this.predicate(this.array[parentPos])) {
      this.swap(pos, parentPos)
      this.headUp2(parentPos)
    }
  }
  heapUp(pos) { // 循环版
    if (pos == 0) {
      return
    }
    for (; ;) {
      let parentPos = (pos - 1) >> 1 //计算pos位置的元素的父节点的位置
      if (this.predicate(this.array[pos]) > this.predicate(this.array[parentPos])) {
        this.swap(pos, parentPos)
        pos = parentPos
      } else {
        break
      }
    }
  }

  // 交换两元素
  swap(i, j) {
    let t = this.array[i]
    this.array[i] = this.array[j]
    this.array[j] = t
  }

  // 查看堆顶元素但不改变它
  peek() {
    return this.array[0]
  }

  // 获取堆长
  get size() {
    return this.array.length
  }
}

RegExp.prototype.mytest = function (str) {
  if (this.exec(str)) {
    return true
  } else {
    return false
  }
}

String.prototype.mymatch = function (re) {
  // re有g选项
  if (re.global) {
    let res = []
    let match
    re.lastIndex = 0 //String不会更新lastIndex的值，需要手动置零
    while (match = re.exec(this)) {
      res.push(match[0])
    }
    return res
  } else {
    return re.exec(this)
  }

}

String.prototype.mymatchAll = function (re) {
  if (re instanceof RegExp) {
    if (!re.global) {
      throw new TypeError("String.prototype.mymatchAll called with a non-global RegExp argument")
    }
  }
  if (typeof re == "string") {
    re = new RegExp(re, "g")
  }
  let match
  let res = []
  let lastIndex = 0
  while (match = re.exec(this)) {
    res.push(match)
  }
  return res
}

String.prototype.mysearch = function (re) {
  // 在字符串里找字符串，直接String.indexOf()
  if (typeof re == "string") {
    return this.indexOf(re)
  } else {

    // 如果目标是正则，获取exec的返回值，如果有则返回exec的index属性，没有返回-1
    let match = re.exec(this)
    if (match) {
      return match.index
    } else {
      return -1
    }
  }

}

String.prototype.myreplace = function (re, replacer) {
  re.lastIndex = 0 //手动清零
  let res = ""
  let match
  let exLastIndex = 0
  while (match = re.exec(this)) { //当目标正则的exec存在，进入循环
    //从左到右依次slice拼接进结果里(  slice(startIndex,endIndex) )
    res += this.slice(exLastIndex, match.index)
    if (typeof replacer == "function") {
      res += replacer(...match, match.index, match.input)
    } else {
      //先将replacer的$i换成match[i]，把$&换成match[0]
      //递归并进入循环里的typeof==函数的分支
      let replacement = replacer.myreplace(/\$([1-9\&])/g, (_, idx) => {
        if (idx == "&") {
          return match[0]
        } else {
          return match[idx]
        }
      })
      res += replacement
    }
    exLastIndex = re.lastIndex
    if (!re.global) {//如果传入的正则没有g选项
      exLastIndex = match.index + match[0].length
      break
    }
  }
  res += this.slice(exLastIndex)
  return res
}

String.prototype.myreplaceAll = function (regexp, replacer) {
  if (!regexp.global) {
    throw new TypeError("String.prototype.myreplaceAll called with a non-global RegExp argument")
  }
  return this.myreplace(regexp, replacer)
}

String.prototype.mysplit = function (re) {
  let res = []
  let match
  re.lastIndex = 0 // String的lastIndex手动清零
  let exLastIndex = 0

  if (typeof re == "string") {
    let idx = this.indexOf(re)
    let move = 0
    while (exLastIndex < this.length) {
      if (move == -1) {
        res.push(this.slice(exLastIndex))
        return res
      }
      res.push(this.slice(exLastIndex, idx + move))
      exLastIndex = idx + move

      while (move == 0) {
        move = this.slice(exLastIndex).indexOf(re)
        exLastIndex++
      }
    }
    return res
  }

  if (!re.global) {// 正则的g选项创建时确定，不能直接修改，可以构造一个实例改变
    re = new RegExp(re.source, "g" + re.flags)
  }

  while (match = re.exec(this)) {
    res.push(this.slice(exLastIndex, match.index))
    res.push(...match.slice(1))
    exLastIndex = re.lastIndex
  }

  res.push(this.slice(exLastIndex))
  return res
}
