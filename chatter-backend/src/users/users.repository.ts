import { Injectable, Logger } from "@nestjs/common";
import { AbstractRepository } from "../common/database/abstract.repository";
import { User } from "./entities/user.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument } from "./entities/user.document";

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument>{
    protected readonly logger = new Logger(UserRepository.name);

    constructor(@InjectModel(User.name) userModel: Model<UserDocument>){
        super(userModel);
    }

}