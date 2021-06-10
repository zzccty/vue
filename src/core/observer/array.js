/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

// 获取数组原型
const arrayProto = Array.prototype
// 克隆一份
export const arrayMethods = Object.create(arrayProto)

// 这7个方法可以改变原始数组
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  // 保存原始方法
  const original = arrayProto[method]
  // 覆盖原始方法
  def(arrayMethods, method, function mutator (...args) {
    // 先执行默认方法
    const result = original.apply(this, args)
    // 变更通知
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // notify change
    //ob 内有个dep，让他去通知更新
    ob.dep.notify()
    return result
  })
})
