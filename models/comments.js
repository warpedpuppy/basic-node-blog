"use strict";

module.exports = function(sequelize, DataTypes) {

  var Comments = sequelize.define("Comments", {
    essay_id: DataTypes.INTEGER,
    name:DataTypes.STRING,
    comment: DataTypes.TEXT


  });

  return Comments;
};
