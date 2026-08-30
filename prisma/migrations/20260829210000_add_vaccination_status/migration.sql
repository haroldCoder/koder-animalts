CREATE TYPE "VaccinationStatus" AS ENUM (
  'PENDING',
  'APPLIED',
  'EXPIRED'
);

ALTER TABLE "Vaccination"
ADD COLUMN "status" "VaccinationStatus" NOT NULL DEFAULT 'PENDING';