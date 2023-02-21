import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'root',
        database: 'auth-microservice',
        logging: false,
      });
      sequelize.addModels([User]);
      await sequelize.sync({ force: true }).then(() => {
        console.log('Database Loaded !!');
      });
      return sequelize;
    },
  },
];
