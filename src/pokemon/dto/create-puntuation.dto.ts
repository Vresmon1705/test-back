 import { IsInt, IsNotEmpty, IsPositive, Max, Min } from 'class-validator';

export class CreatePuntuationDto {
  @IsNotEmpty()
  id: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(5)
  puntuation: number;
}
