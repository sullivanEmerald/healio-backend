import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shift } from './schema/shifts.schema';
import { CreateShiftDto } from './dto/shifts.dto';
import { ShiftStatus } from './schema/shifts.schema';
import { Application, ApplicationDocument } from 'src/application/schema/application.schema';


@Injectable()
export class ShiftsService {
    constructor(
        @InjectModel(Shift.name) private shiftModel: Model<Shift>,
        @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,

    ) { }

    async createShift(createShiftDto: CreateShiftDto, providerId: string) {
        const shift = new this.shiftModel({ ...createShiftDto, providerId });
        return shift.save();
    }

    async findShiftsByProvider(providerId: string) {
        return this.shiftModel.find({
            providerId,
            status: { $in: [ShiftStatus.PUBLISHED, ShiftStatus.DRAFT] },
        })
            .sort({ createdAt: -1 })
            .populate('assignedCarerId', 'firstName lastName')
            .exec();
    }

    async findShiftById(shiftId: string) {
        const shiftApplications = await this.applicationModel.find({ shiftId }).populate('carerId', 'firstName lastName updatedAt').exec();
        const shift = await this.shiftModel.findById(shiftId).exec();
        console.log('shifts for edit', shift)
        return { shift, applications: shiftApplications };
    }

    async getAllShifts(filters: any, carerId: string) {
        const query: any = {
            status: ShiftStatus.PUBLISHED,
        };

        // Date range filter
        if (filters.startDate || filters.endDate) {
            query.startDate = {};
            if (filters.startDate) {
                const start = new Date(filters.startDate);
                start.setHours(0, 0, 0, 0);
                query.startDate.$gte = start;
            }
            if (filters.endDate) {
                const end = new Date(filters.endDate);
                end.setHours(23, 59, 59, 999);
                query.startDate.$lte = end;
            }
        } else {
            // Default: only future shifts
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            query.startDate = { $gte: today };
        }

        // Payment frequency filter
        if (filters.paymentFrequency) {
            query.paymentFrequency = filters.paymentFrequency;
        }

        // Shift type filter
        if (filters.shiftType) {
            query.shiftType = filters.shiftType;
        }

        // Hourly rate filter (assuming hourlyRate is stored as a string, convert to number for comparison)
        if (filters.minRate || filters.maxRate) {
            query.amount = {};
            if (filters.minRate) {
                query.amount.$gte = Number(filters.minRate);
            }
            if (filters.maxRate) {
                query.amount.$lte = Number(filters.maxRate);
            }
        }
        // State filter (status)
        if (filters.state) {
            query.state = filters.state;
        }

        if (filters.search && filters.search.trim() !== "") {
            const searchRegex = new RegExp(filters.search.trim(), "i");
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { shiftType: searchRegex }
            ];
        }

        const applications = await this.applicationModel.find({ carerId });
        const appliedShiftIds = applications.map(a => a.shiftId);

        if (appliedShiftIds.length > 0) {
            query._id = { $nin: appliedShiftIds };
        }

        // Query and populate
        return this.shiftModel.find(query)
            .populate('providerId', 'firstName lastName')
            .sort({ startDate: 1 })
            .exec();
    }

    async updateShiftAssignedCarer(shiftId: string, carerId: string) {
        return await this.shiftModel.findByIdAndUpdate(
            shiftId,
            {
                assignedCarerId: carerId, // carerId should already be an ObjectId or string
                status: ShiftStatus.ASSIGNED,
            },
            { new: true }
        );
    }

    async updateShift(shiftId: string, updateData: Partial<CreateShiftDto>) {
        return await this.shiftModel.findByIdAndUpdate(shiftId, updateData, { new: true });
    }

    async saveDraftShift(draftData: Partial<CreateShiftDto>, providerId: string) {
        const draftShift = new this.shiftModel({ ...draftData, providerId, status: ShiftStatus.DRAFT });
        return await draftShift.save();
    }
}
