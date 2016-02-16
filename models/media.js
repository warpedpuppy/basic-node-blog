"use strict";

module.exports = function(sequelize, DataTypes) {
  var Media = sequelize.define("Media_table", {
    title: DataTypes.STRING,
    author:DataTypes.STRING,
    genre: DataTypes.ENUM("television", "movie", "book", "music")


  });

  return Media;
};
