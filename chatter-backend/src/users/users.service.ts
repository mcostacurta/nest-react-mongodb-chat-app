import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRepository } from './users.repository';
import { S3Service } from '../common/s3/s3.service';
import { USERS_BUCKET, USERS_IMAGE_FILE_EXTENSION } from './user.constants';
import { UserDocument } from './entities/user.document';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(private readonly userRepository: UserRepository, private readonly s3Service: S3Service){}

  async create(createUserInput: CreateUserInput) {

    try {
      return this.toEntity(await this.userRepository.create({
        ...createUserInput,
        password: await this.hashPassword(createUserInput.password)
      }));
    } catch (err) {
     if(err.message.includes('E11000')){
      throw new UnprocessableEntityException('Email already exists.');
     }
     throw err;
    }

    
  }

  async uploadImage(file: Buffer, userId: string){
    await this.s3Service.upload({
      bucket: USERS_BUCKET,
      key: this.getUSerImage(userId),
      file,
    });
  }

  async findAll() {
    return (await this.userRepository.find({})).map((userDocument) =>
      this.toEntity(userDocument),
    );
  }

  async findOne(_id: string) {
    return this.toEntity(await this.userRepository.findOne({ _id }));
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if(updateUserInput.password)
      updateUserInput.password =  await this.hashPassword(updateUserInput.password)

    return this.toEntity(await this.userRepository.findOneAndUpdate({ _id }, {
      $set: {
        ...updateUserInput,
      }
    }));
  }

  async remove(_id: string) {
    return this.toEntity(await this.userRepository.findOneAndDelete({ _id }));
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email })
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if(!password)
      throw new UnauthorizedException('Invalid Credentials.');

    return this.toEntity(user);
  }

  private async hashPassword(password: string){
    return bcrypt.hash(password, 10);
  }

  private getUSerImage(userId: string){
    return `${userId}.${USERS_IMAGE_FILE_EXTENSION}`;
  }

  toEntity(userDocument: UserDocument): User {
    const user = {
      ...userDocument,
      imageUrl: this.s3Service.getObjectUrl(
        USERS_BUCKET,
        this.getUSerImage(userDocument._id.toHexString())
      )
    }
    delete (user as any).password;

    return user;
  }
}