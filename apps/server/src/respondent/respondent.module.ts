import { Module } from '@nestjs/common';
import { RespondentService } from './respondent.service';
import { RespondentController } from './respondent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Respondent, RespondentSchema } from 'schemas/respondent.schema';
import {
  RespondentAnswer,
  RespondentAnswerSchema,
} from 'schemas/respondent-answer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Respondent.name, schema: RespondentSchema },
      { name: RespondentAnswer.name, schema: RespondentAnswerSchema },
    ]),
  ],
  providers: [RespondentService],
  controllers: [RespondentController],
})
export class RespondentModule {}
