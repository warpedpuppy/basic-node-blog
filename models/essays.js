"use strict";

module.exports = function(sequelize, DataTypes) {
  var Media = sequelize.define("essays", {
    title: DataTypes.TEXT,
    essay:DataTypes.TEXT


  });

  return Media;
};
