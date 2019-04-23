'use strict';
module.exports = (sequelize, DataTypes) => {
  const links = sequelize.define('links', {
    url: DataTypes.STRING,
    hash: DataTypes.STRING
  }, {});
  links.associate = function(models) {
    // associations can be defined here
  };
  return links;
};