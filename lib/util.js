'use strict'

/**
 * adonis-framework
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const i = require('inflect')
const _ = require('lodash')
const prettyHrtime = require('pretty-hrtime')
const util = exports = module.exports = {}
const isolatedLodash = _.runInContext()

/**
 * makes table name from a class defination
 *
 * @method makeTableName
 *
 * @param  {Object}      Model
 * @return {String}
 *
 * @public
 */
util.makeTableName = function (Model) {
  let modelName = Model.name
  modelName = i.pluralize(modelName)
  return i.underscore(modelName)
}

/**
 * makes a foreign key from a class
 * defination
 *
 * @method makeForeignKey
 * @param  {Object}       Model
 * @return {String}
 *
 * @public
 */
util.makeForeignKey = function (Model) {
  let modelName = Model.name
  modelName = i.singularize(modelName)
  return `${i.underscore(modelName)}_id`
}

/**
 * wraps an object into lodash collection
 *
 * @method toCollection
 * @param  {Array|Object}     values
 * @return {Array|Object}
 *
 * @public
 */
util.toCollection = function (values) {
  return isolatedLodash(values)
}

/**
 * returns isolated instance of lodash, it is also
 * used while wrapping values in a collection.
 *
 * @method lodash
 *
 * @return {Object}
 */
util.lodash = function () {
  return isolatedLodash
}

/**
 * adds a mixin to the lodash instance
 *
 * @method addMixin
 * @param  {String} name
 * @param  {Function} method
 * @param  {Object} extras
 *
 * @public
 */
util.addMixin = function (name, method, extras) {
  const mixin = {}
  mixin[name] = method
  isolatedLodash.mixin(mixin, extras)
}

/**
 * makes a getter name for a given field
 *
 * @method makeGetterName
 * @param  {String}       name
 * @return {String}
 *
 * @public
 */
util.makeGetterName = function (name) {
  return `get${i.camelize(i.underscore(name))}`
}

/**
 * makes a getter name for a given field
 *
 * @method makeSetterName
 * @param  {String}       name
 * @return {String}
 *
 * @public
 */
util.makeSetterName = function (name) {
  return `set${i.camelize(i.underscore(name))}`
}

/**
 * map values for a given key and returns
 * the transformed array with that key only
 *
 * @method mapValuesForAKey
 * @param  {Array}         values
 * @param  {String}         key
 * @return {Array}
 *
 * @public
 */
util.mapValuesForAKey = function (values, key) {
  return _.map(values, function (value) {
    return value[key]
  })
}

/**
 * calculates offset for a given page using
 * page and perPage options
 *
 * @method returnOffset
 * @param  {Number}     page
 * @param  {Number}     perPage
 * @return {Number}
 *
 * @public
 */
util.returnOffset = function (page, perPage) {
  return page === 1 ? 0 : ((perPage * (page - 1)))
}

/**
 * validates a page to be a number and greater
 * than 0. this is something required to paginate results.
 *
 * @method validatePage
 * @param  {Number}     page
 * @return {void}
 * @throws {Error} If page is not a number of less than 1
 *
 * @public
 */
util.validatePage = function (page) {
  if (typeof (page) !== 'number') {
    throw new Error('page parameter is required to paginate results')
  }
  if (page < 1) {
    throw new Error('cannot paginate results for page less than 1')
  }
}

/**
 * make meta data for paginated results.
 *
 * @method makePaginateMeta
 *
 * @param  {Number}         total
 * @param  {Number}         page
 * @param  {Number}         perPage
 * @return {Object}
 *
 * @public
 */
util.makePaginateMeta = function (total, page, perPage) {
  const resultSet = {
    total: total,
    currentPage: page,
    perPage: perPage,
    lastPage: 0,
    data: []
  }
  if (total > 0) {
    resultSet.lastPage = Math.ceil(total / perPage)
  }
  return resultSet
}

/**
 * capitalizes a given string
 *
 * @method capitalize
 * @param {String} value
 * @return {String}
 *
 * @public
 */
util.capitalize = i.capitalize

/**
 * returns human readable time difference between
 * 2 dates
 *
 * @method time
 *
 * @param  {Date} start
 * @return {String}
 *
 * @public
 */
util.timeDiff = function (start) {
  let end = process.hrtime(start)
  return prettyHrtime(end)
}