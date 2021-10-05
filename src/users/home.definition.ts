import { IsAscii, MinLength, MaxLength, IsPostalCode } from "class-validator"

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
