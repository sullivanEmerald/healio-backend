import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shift } from './schema/shifts.schema';
import { CreateShiftDto } from './dto/shifts.dto';
import { ShiftStatus } from './schema/shifts.schema';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectModel(Shift.name) private shiftModel: Model<Shift>,
    ) { }

    async createShift(createShiftDto: CreateShiftDto, providerId: string) {
        const shift = new this.shiftModel({ ...createShiftDto, providerId });
        return shift.save();
    }

    async findShiftsByProvider(providerId: string) {
        return this.shiftModel.find({ providerId }).sort({ startDate: -1 }).exec();
    }

    async findShiftById(shiftId: string) {
        return this.shiftModel.findById(shiftId).exec();
    }

    async getAllShifts() {
        return this.shiftModel.find({
            startDate: { $gte: new Date() },
            status: ShiftStatus.PUBLISHED,
        }).populate('providerId', 'firstName lastName').sort({ startDate: 1 }).exec();
    }
}
