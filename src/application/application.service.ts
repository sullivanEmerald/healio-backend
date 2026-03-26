import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument } from './schema/application.schema';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    ) { }

    async createApplication(applicationData: { shiftId: string, carerId: string }) {
        const newApplication = new this.applicationModel(applicationData);
        return await newApplication.save();
    }

}
