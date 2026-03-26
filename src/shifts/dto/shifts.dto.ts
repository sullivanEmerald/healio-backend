import { IsString, IsDate, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateShiftDto {
    @IsString()
    title: string;

    @IsString()
    state: string;

    @IsOptional()
    @IsDate()
    startDate?: Date;

    @IsOptional()
    @IsDate()
    endDate?: Date;

    @IsString()
    startTime: string;

    @IsString()
    endTime: string;

    @IsString()
    shiftType: string;

    @IsNumber()
    numberOfCarers: number;

    @IsString()
    description: string;

    @IsString()
    skills: string;

    @IsString()
    experience: string;

    @IsString()
    genderPreference: string;

    @IsString()
    language: string;

    @IsBoolean()
    enhancedDBS: boolean;

    @IsBoolean()
    rightToWork: boolean;

    @IsBoolean()
    isReoccuringShift: boolean;

    @IsString()
    amount: string;

    @IsString()
    expenses: string;

    @IsString()
    paymentFrequency: string;
}
