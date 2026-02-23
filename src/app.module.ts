import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@/common/infrastructure/prisma.module';
import { AuthModule } from '@auth/auth.module';
import { OwnerModule } from '@owner/owner.module';
import { VeterinarianModule } from '@veterinarian/veterinarian.module';
import { VeterinaryClinicsModule } from '@veterinary-clinics/veterinary-clinics.module';

@Module({
  imports: [PrismaModule, AuthModule, OwnerModule, VeterinarianModule, VeterinaryClinicsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
