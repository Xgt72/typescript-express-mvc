import { IsString } from "class-validator";

class CreateUserDto {
  @IsString()
  public firstname: string;

  @IsString()
  public lastname: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;
}

export default CreateUserDto;
