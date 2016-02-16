"use strict";

module.exports = function(sequelize, DataTypes) {
  var Media = sequelize.define("media_created", {
    title: DataTypes.STRING,
    description:DataTypes.TEXT


  });

  return Media;
};
