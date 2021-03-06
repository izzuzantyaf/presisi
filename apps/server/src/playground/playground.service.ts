import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LearningMethodRecommendation,
  LearningMethodRecommendationDocument,
} from '../../schemas/learningMethodRecommendation';
import {
  RespondentAnswer,
  RespondentAnswerDocument,
} from '../../schemas/respondent-answer.schema';
// import { Rspd, RspdDocument } from '../../schemas/rspd.schema';
// import {
//   Respondent,
//   RespondentDocument,
// } from '../../schemas/respondent.schema';
// import * as mongoose from 'mongoose';

@Injectable()
export class PlaygroundService {
  constructor(
    // @InjectModel(Respondent.name)
    // private respondentModel: Model<RespondentDocument>,
    @InjectModel(RespondentAnswer.name)
    private respondentAnswerModel: Model<RespondentAnswerDocument>,
    // @InjectModel(Rspd.name)
    // private rspdModel: Model<RspdDocument>,
    @InjectModel(LearningMethodRecommendation.name)
    private learningMethodRecommendationModel: Model<LearningMethodRecommendationDocument>,
  ) {}

  async findAllAnswers() {
    return await this.respondentAnswerModel
      .find()
      .populate('respondent_id')
      .exec();
  }

  async storeAnswers(respondent, questionnaireAnswers) {
    // const { respondent, questionnaireAnswers } = storeAnswerDto;

    // menghitung CF tiap tipe gaya belajar
    const learningTypesResult = this.scoreLearningTypes(questionnaireAnswers);

    // menentukan tipe gaya belajar yang paling cocok
    const bestLearningTypes = this.findTheBestLearningType(learningTypesResult);

    // memilih rekomendasi cara belajar yang sesuai berdasarkan tipe gaya belajar
    const learningMethodRecommendations = await this.recommendLearningMethods(
      bestLearningTypes,
    );

    // menyimpan data responden ke database
    // respondent._id = new mongoose.Types.ObjectId(respondent._id);
    // respondent._id = {
    //   $oid: respondent._id,
    // };
    respondent.learningTypes = learningTypesResult;
    respondent.bestLearningTypes = bestLearningTypes;
    respondent.learningMethodRecommendations = learningMethodRecommendations;
    // const storedRespondent = await this.rspdModel.create(respondent);

    // // menyimpan data jawaban responden ke database
    // await this.respondentAnswerModel.create({
    //   respondent_id: respondent._id,
    //   questionnaireAnswers: questionnaireAnswers,
    // });

    return respondent;
  }

  private scoreLearningTypes(questionnaireAnswers: any[]): object {
    const visual: number = this.calculateLearningTypeCf(
      questionnaireAnswers,
      'visual',
    );
    const auditory: number = this.calculateLearningTypeCf(
      questionnaireAnswers,
      'auditory',
    );
    const readWrite: number = this.calculateLearningTypeCf(
      questionnaireAnswers,
      'readWrite',
    );
    const kinesthetic: number = this.calculateLearningTypeCf(
      questionnaireAnswers,
      'kinesthetic',
    );

    return { visual, auditory, readWrite, kinesthetic };
  }

  private calculateLearningTypeCf(
    questionnaireAnswers: any[],
    type: string,
  ): number {
    // menghitung cf kombinasi (CF user * CF expert)
    const combinationCfs: number[] = questionnaireAnswers.map((question) => {
      const answer = question.answerChoices.filter(
        (answer) => answer.type == type,
      )[0];
      return answer.userCf * answer.expertCf;
    });
    // menghitung CF final
    let oldCf = combinationCfs[0];
    for (let i = 1; i < combinationCfs.length; i++) {
      oldCf = oldCf + combinationCfs[i] * (1 - oldCf);
    }
    return oldCf;
  }

  private findTheBestLearningType(learningTypesResult: object): string[] {
    const cfs: number[] = [];
    for (const key in learningTypesResult) {
      cfs.push(learningTypesResult[key]);
    }
    const maxCf = Math.max(...cfs);
    const bestLearningTypes: string[] = [];
    for (const key in learningTypesResult) {
      if (learningTypesResult[key] === maxCf) {
        bestLearningTypes.push(key);
      }
    }

    return bestLearningTypes;
  }

  private async recommendLearningMethods(bestLearningTypes: string[]) {
    // memilih rekomendasi cara belajar
    return await this.learningMethodRecommendationModel
      .find({ type: bestLearningTypes })
      .exec();
  }
}
