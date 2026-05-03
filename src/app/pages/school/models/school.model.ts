import { Management, Ugel } from '../constants/school.constant';

export type { Management, Ugel };

export interface School {
    readonly id: number;
    companyName: string;
    businessName: string;
    management: Management;
    address: string;
    email: string;
    phoneNumber: string;
    logoPath?: string | null;
    ruc: string;
    dre?: string | null;
    ugel?: Ugel | null;
    headmasterId: number;
    deputyDirectorId?: number | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

export interface SchoolDto {
    companyName: string;
    businessName: string;
    management: Management;
    address: string;
    email: string;
    phoneNumber: string;
    logoPath?: string | null;
    ruc: string;
    dre?: string | null;
    ugel?: Ugel | null;
    headmasterId: number;
    deputyDirectorId?: number | null;
}