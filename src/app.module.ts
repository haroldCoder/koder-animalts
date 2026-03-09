import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@/common/infrastructure/prisma.module';
import { AuthModule } from '@auth/auth.module';
import { OwnerModule } from '@owner/owner.module';
import { VeterinarianModule } from '@veterinarian/veterinarian.module';
import { VeterinaryClinicsModule } from '@veterinary-clinics/veterinary-clinics.module';
import { DocumentModule } from '@document/document.module';
import { PetModule } from '@pet/pet.module';
import { MedicalRecordModule } from '@medical-record/medical-record.module';
import { VaccinationModule } from '@vaccination/vaccination.module';
import { UserModule } from './modules/user/user.module';


@Module({
  imports: [PrismaModule, AuthModule, OwnerModule, VeterinarianModule, VeterinaryClinicsModule, DocumentModule, PetModule, MedicalRecordModule, VaccinationModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
