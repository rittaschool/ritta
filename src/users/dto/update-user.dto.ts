import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsAlphanumeric, IsAscii, IsEmail, IsObject, IsPostalCode, IsUUID, MaxLength, MinLength } from "class-validator";
import { User } from "../schemas/user.schema";

export class UpdateUserDto extends PartialType(OmitType(User, ['id', 'isFirstLogin', 'accounts', 'latestLogin', 'latestPasswordChange', 'secret', 'password'])) {
    @IsUUID('4')
    id: string

    @IsAlphanumeric()
    @MinLength(1)
    @MaxLength(20)
    firstName?: string;
    
    @IsAlphanumeric()
    @MinLength(1)
    @MaxLength(20)
    lastName?: string

    @MaxLength(20)
    @MinLength(1)
    @IsAlphanumeric()
    alias?: string

    @MaxLength(30)
    @MinLength(3)
    @IsAscii()
    username?: string

    @IsEmail()
    email?: string

    @IsObject()
    home?: HomeAddress
}

export class HomeAddress {
    @IsAscii()
    @MinLength(1)
    @MaxLength(100)
    address: string

    @IsPostalCode('FI')
    postalCode: string

    @IsAscii()
    @MinLength(3)
    @MaxLength(50)
    city: string
}
