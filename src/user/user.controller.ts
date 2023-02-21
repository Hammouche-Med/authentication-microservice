import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AppResponse } from 'src/shared/interfaces/app-response.interface';
import { getPagination, getPagingData } from 'src/utils/utils';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<AppResponse> {
    try {
      const data = await this.userService.create(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User create',
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<AppResponse> {
    try {
      const { limit, offset } = getPagination(page, size);
      const result = await this.userService.findAll(limit, offset);
      const data = getPagingData(result, page, limit);
      return {
        statusCode: HttpStatus.OK,
        message: 'User findAndCountAll',
        data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/search')
  async search(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('size') size: number,
  ): Promise<AppResponse> {
    try {
      const { limit, offset } = getPagination(page, size);
      const result = await this.userService.search(query, limit, offset);
      const data = getPagingData(result, page, limit);

      return {
        statusCode: HttpStatus.OK,
        message: 'User searchAndCountAll',
        data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AppResponse> {
    try {
      const data = await this.userService.findOne(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'User findOne',
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<AppResponse> {
    try {
      const data = await this.userService.update(id, updateUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User update',
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<AppResponse> {
    try {
      const data = await this.userService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'User remove',
        data: data,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
