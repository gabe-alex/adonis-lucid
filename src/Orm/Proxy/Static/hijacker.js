'use strict'

const helpers = require('./helpers')

let hijacker = exports = module.exports = {}

/**
 * @function then
 * @description here we hijack then method on db
 * query builder, it is required to return
 * collection , set visibility and mutate
 * fields
 * @param  {Object}   target
 * @param  {String}   name
 * @param  {Function} cb
 */
hijacker.then = function (target,name,cb) {

  /**
   * checking if soft deletes are enabled and user has not
   * called withTrashed , if above true conditions we
   * will not fetch deleted values
   */
  if (target.softDeletes && !target.disableSoftDeletes) {
    target.activeConnection.where(target.softDeletes, null)
  }

  return target.activeConnection[name](function (values) {

    /**
     * here we set visibility of values fetched
     * from model query.
     */
    values = helpers.setVisibility(target, values)

    /**
     * finally before returning we need to mutate values
     * by calling getters defined on model
     */
    values = helpers.mutateValues(target, values)

    cb(values)

  }).finally(function () {

    /**
     * here we empty query chain after returning
     * all data, it is required otherwise old
     * methods will be called while making a
     * new query
     */
    target.new()

  })
}

/**
 * @function find
 * @description find methods returns a model instance
 * with single user attributes attached to model
 * attributes
 * @param  {Object} target [description]
 * @param  {Number} id     [description]
 * @return {Object}        [description]
 */
hijacker.find = function (target,id) {
  return new Promise(function (resolve, reject) {
    target
    .activeConnection
    .where(target.primaryKey, id)
    .first()
    .then(function (values) {

      let instance = new target(values)
      instance.connection.where(target.primaryKey, id)
      resolve(instance)

    })
    .catch(reject)
    .finally(function () {

      /**
       * here we empty query chain after returning
       * all data, it is required otherwise old
       * methods will be called while making a
       * new query
       */
      target.new()

    })
  })
}
