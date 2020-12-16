import { IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  userName: string;
}
