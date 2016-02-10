"use strict";



module.exports = function(sequelize, DataTypes) {
  var Essays = sequelize.define("essays", {
    essay_title: DataTypes.TEXT,
    essay:DataTypes.TEXT



  });


  return Essays;
};

