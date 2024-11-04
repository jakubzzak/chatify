import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateRoomInput {
  @Field(() => String)
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  @ApiProperty({
    type: String,
  })
  name: string;

  @Field(() => Boolean)
  @IsBoolean()
  @ApiProperty({
    type: Boolean,
  })
  isPrivate: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  @ApiProperty({
    type: Boolean,
  })
  isPersistent: boolean;
}
