"use strict";

module.exports = function(sequelize, DataTypes) {

  var Comments = sequelize.define("Comments", {
    essay_id: DataTypes.INTEGER,
    name:DataTypes.STRING,
    comment: DataTypes.TEXT,
    essay_title:DataTypes.TEXT,
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }


  });

  return Comments;
};
