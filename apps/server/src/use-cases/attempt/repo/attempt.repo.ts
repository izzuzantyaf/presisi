import { Injectable, Logger } from '@nestjs/common';
import { isNotEmpty } from 'class-validator';
import { PrismaClientService } from 'src/database/prisma/prisma-client.service';
import { CreateAttemptDto } from '../dto/create-attempt.dto';
import { Attempt } from '../entities/attempt.entity';
import { IAttemptRepo } from '../interfaces/attempt-repo.interface';

@Injectable()
export class AttemptRepository implements IAttemptRepo {
  private readonly logger = new Logger(AttemptRepository.name);

  constructor(private prisma: PrismaClientService) {}

  async create(data: CreateAttemptDto): Promise<Attempt> {
    const createdAttempt = await this.prisma.attempt
      .create({
        data: {
          user_id: data.user_id,
        },
      })
      .then((result) => {
        this.logger.log(
          `Attempt stored ${JSON.stringify({
            id: result.id,
            user_id: data.user_id,
          })}`,
        );
        return result;
      })
      .catch((error) => {
        this.logger.error(`Storing attempt failed ${JSON.stringify(error)}`);
        throw error;
      });
    return new Attempt(createdAttempt);
  }

  async findById(id: string | number): Promise<Attempt> {
    let attempt;
    try {
      attempt = await this.prisma.attempt.findUnique({
        where: { id: parseInt(id as string) },
      });
    } catch (error) {
      this.logger.debug(error);
    }
    return isNotEmpty(attempt) ? new Attempt(attempt) : null;
  }

  async findByUserId(userId: number): Promise<Attempt[]> {
    let attempts: Attempt[] = [];
    try {
      attempts = await this.prisma.attempt.findMany({
        select: {
          id: true,
          created_at: true,
          updated_at: true,
          attempt_results: {
            select: {
              final_cf: true,
              learning_style_id: true,
              attempt_id: true,
              learning_style: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        where: { user_id: userId },
      });
    } catch (error) {
      this.logger.debug(error);
    }
    return attempts.map((attempt) => new Attempt(attempt));
  }

  async deleteById(id: number): Promise<Attempt> {
    let attempt: Attempt;
    try {
      attempt = await this.prisma.attempt.delete({ where: { id } });
    } catch (error) {
      this.logger.debug(error);
      throw error;
    }
    return attempt;
  }
}
