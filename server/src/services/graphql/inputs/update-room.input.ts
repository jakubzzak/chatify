import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class UpdateRoomInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @IsOptional()
  name?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isPersistent?: boolean;
}
