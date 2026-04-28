import { IsString, Length, Matches } from 'class-validator';

export class IdentifyDto {
  @IsString()
  @Length(2, 32)
  @Matches(/^[a-zA-Z0-9_\-\.]+$/, {
    message: 'username must be alphanumeric plus _-.'
  })
  username!: string;
}
