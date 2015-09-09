'use strict';

const ServiceProvider = require('fold').ServiceProvider
const Database = require('../src/Database')

class DatabaseProvider extends ServiceProvider{

  static get inject(){
    return ["Adonis/Src/Env", "Adonis/Src/Config"]
  }

  * register() {
    this.app.singleton('Adonis/Src/Database', function (Env,Config) {
      return new Database(Env,Config)
    })
  }

}

module.exports = DatabaseProvider