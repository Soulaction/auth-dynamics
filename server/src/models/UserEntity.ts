import {sequelize} from "../config/DbConfig";
import {DataTypes} from "sequelize";
import {TokenEntity} from "./TokenEntity";

export const UserEntity = sequelize.define('user', {
    id: {type: DataTypes.UUID, primaryKey: true},
    login: {type: DataTypes.STRING, unique: true, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, allowNull: false, defaultValue: 'USER'},
    isActivate: {type: DataTypes.BOOLEAN, defaultValue: false}
});

UserEntity.hasMany(TokenEntity);
TokenEntity.belongsTo(UserEntity);
