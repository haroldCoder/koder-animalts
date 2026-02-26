import { Module } from '@nestjs/common';
import { VaccinationService } from './infrastructure/vaccination.service';
import { VaccinationController } from './infrastructure/vaccination.controller';
import { PrismaModule } from '@/common/infrastructure/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [VaccinationService],
    controllers: [VaccinationController],
    exports: [VaccinationService],
})
export class VaccinationModule { }
