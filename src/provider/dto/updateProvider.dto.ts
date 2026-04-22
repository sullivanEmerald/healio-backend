// the fields are firstName, lastName, bussinessEmail and phoneNumber. build the dto
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateProviderDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    businessEmail?: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber?: string;
}