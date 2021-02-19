"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {}
  }
  Message.init(
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
      },
      from: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      to: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
    }
  );
  return Message;
};
