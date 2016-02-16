"use strict";

module.exports = function(sequelize, DataTypes) {

  var map_data = sequelize.define("map_data", {
    longitude: DataTypes.DECIMAL,
    latitude:DataTypes.DECIMAL,
    city: DataTypes.TEXT,
    state:DataTypes.TEXT,
    country:DataTypes.TEXT

  });

  return map_data;
};
