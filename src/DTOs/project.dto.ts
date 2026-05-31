import { Type } from "class-transformer";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from "class-validator";


export class CreateProjectDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;
}

export class UpdateProjectDTO {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

}

export class ProjectIdDTO {
  @IsUUID()
  id!: string;
}

