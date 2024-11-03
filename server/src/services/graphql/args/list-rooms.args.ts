import { ArgsType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

@ArgsType()
export class ListRoomsArgs {
  @Field(() => String, { defaultValue: 'all', nullable: true })
  @IsEnum(['all', 'member', 'not_member'])
  @IsOptional()
  type?: 'all' | 'member' | 'not_member';
}
