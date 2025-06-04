import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { AbstractEntity } from '../../common/database/abstract.entity';
import { Message } from '../messages/entities/message.entity';

@ObjectType()
export class Chat extends AbstractEntity{
  
  @Field({ nullable: true })
  @Prop()
  name: string; 
  
  @Field(() => Message, { nullable: true })
  latestMessage?: Message;

}