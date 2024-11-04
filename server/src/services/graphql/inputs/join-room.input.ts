import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class JoinRoomInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  roomId: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  code: string;
}
