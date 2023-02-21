import { DataTypes } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Unique,
  AllowNull,
  Scopes,
  DefaultScope,
} from 'sequelize-typescript';
@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
}))
@Scopes(() => ({
  auth: {
    attributes: { include: ['password'] },
  },
}))
@Table({
  modelName: 'users',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @AllowNull(false)
  @Column
  first_name: string;

  @AllowNull(false)
  @Column
  last_name: string;

  @AllowNull(false)
  @Unique
  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(true)
  @Column
  avatar: string;

  @AllowNull(true)
  @Column
  reset_token: string;
}
