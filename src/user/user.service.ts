import { hash } from 'bcrypt';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { isEmpty } from 'src/utils/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (isEmpty(createUserDto))
      throw new HttpException('INVALID_DATA', HttpStatus.BAD_REQUEST);
    const findUser: User = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (findUser)
      throw new HttpException(
        `THIS_EMAIL_IS_ALREADY_USED`,
        HttpStatus.CONFLICT,
      );
    const hashedPassword = await hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const response = await this.userRepository.create({
      ...createUserDto,
    });
    return response;
  }

  async findAll(limit: number, offset: number) {
    const response = await this.userRepository.findAndCountAll({
      limit,
      offset,
    });
    if (!response)
      throw new HttpException('INVALID_RESOURCE', HttpStatus.CONFLICT);
    return response;
  }

  async search(query: string, limit: number, offset: number) {
    const response = await this.userRepository.findAndCountAll({
      limit,
      offset,
      where: {
        [Op.or]: [
          {
            first_name: {
              [Op.iLike]: '%' + query,
            },
          },
          {
            last_name: {
              [Op.iLike]: '%' + query,
            },
          },
          {
            email: {
              [Op.iLike]: '%' + query,
            },
          },
          {
            first_name: {
              [Op.iLike]: query + '%',
            },
          },
          {
            last_name: {
              [Op.iLike]: query + '%',
            },
          },
          {
            email: {
              [Op.iLike]: query + '%',
            },
          },
          {
            first_name: {
              [Op.iLike]: '%' + query + '%',
            },
          },
          {
            last_name: {
              [Op.iLike]: '%' + query + '%',
            },
          },
          {
            email: {
              [Op.iLike]: '%' + query + '%',
            },
          },
        ],
      },
    });
    if (!response)
      throw new HttpException('INVALID_RESOURCE', HttpStatus.CONFLICT);
    return response;
  }

  async findOne(id: string) {
    if (isEmpty(id))
      throw new HttpException('INVALID_ID', HttpStatus.BAD_REQUEST);
    const response = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!response)
      throw new HttpException('INVALID_RESOURCE', HttpStatus.CONFLICT);
    return response;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (isEmpty(id))
      throw new HttpException('INVALID_ID', HttpStatus.BAD_REQUEST);
    if (isEmpty(updateUserDto))
      throw new HttpException('INVALID_DATA', HttpStatus.BAD_REQUEST);
    const updates = await this.userRepository.update(
      { ...updateUserDto },
      { where: { id } },
    );
    if (!updates[0])
      throw new HttpException('INVALID_RESOURCE', HttpStatus.CONFLICT);
    const response = await this.userRepository.findOne({ where: { id } });
    return response;
  }

  async remove(id: string) {
    if (isEmpty(id))
      throw new HttpException('INVALID_ID', HttpStatus.BAD_REQUEST);
    const response = await this.userRepository.destroy({ where: { id } });
    if (!response)
      throw new HttpException('INVALID_RESOURCE', HttpStatus.CONFLICT);
    return id;
  }

  async findUserByEmail(email: string): Promise<User | false> {
    const findUser: User = await this.userRepository.scope('auth').findOne({
      where: { email: email },
    });
    if (!findUser) return false;
    return findUser;
  }

  async changePwd(id: string, password: string) {
    const hashedPassword = await hash(password, 10);
    return this.userRepository.update(
      { password: hashedPassword },
      { where: { id: id } },
    );
  }
}
