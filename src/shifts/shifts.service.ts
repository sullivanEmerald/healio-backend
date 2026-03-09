import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shift } from './schema/shifts.schema';
import { CreateShiftDto } from './dto/shifts.dto';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectModel(Shift.name) private shiftModel: Model<Shift>,
    ) { }

    async createShift(createShiftDto: CreateShiftDto, providerId: string) {
        const shift = new this.shiftModel({ ...createShiftDto, providerId });
        return shift.save();
    }
}
