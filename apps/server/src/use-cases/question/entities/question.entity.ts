import { AnswerChoice } from 'src/use-cases/answer-choice/entities/answer-choice.entity';

export type QuestionConstructorProps = Partial<
  Pick<
    Question,
    'id' | 'question' | 'answer_choices' | 'created_at' | 'updated_at'
  >
>;

export class Question {
  id?: number;
  question: string;
  answer_choices: AnswerChoice[];
  created_at?: Date | string;
  updated_at?: Date | string;

  constructor(props: QuestionConstructorProps) {
    Object.assign(this, props);
  }
}
