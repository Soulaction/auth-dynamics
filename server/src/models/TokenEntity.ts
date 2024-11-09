import {sequelize} from "../config/DbConfig";
import {DataTypes} from "sequelize";

export const TokenEntity = sequelize.define('token', {
    id: {type: DataTypes.UUID, primaryKey: true},
    token: {type: DataTypes.STRING, unique: true, allowNull: false},
    ua: {type: DataTypes.STRING, allowNull: false},
    ip: {type: DataTypes.STRING, allowNull: false}
});
