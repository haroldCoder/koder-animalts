import { Injectable } from '@nestjs/common';
import { TransactionManager } from '@/common/domain/ports';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaTransactionManager extends TransactionManager {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async run<T>(work: () => Promise<T>): Promise<T> {
        return this.prisma.$transaction(() => work());
    }
}
