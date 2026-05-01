export type Management = 'Pública' | 'Privada';
export type Ugel = 'Satipo' | 'Río Negro' | 'Mazamari' | 'Pangoa' | 'Pichanaki' | 'Río Tambo' | 'La Merced' | 'Concepción' | 'Jauja' | 'Huancayo' | 'Otro';


export const MANAGEMENT_OPTIONS: {value: Management, label: Management}[] = [
    {value: 'Pública', label:'Pública'},
    {value: 'Privada', label:'Privada'},
];

export const UGEL: {value: Ugel, label: string}[] = [
    {value: 'Satipo', label:'UGEL - Satipo'},
    {value: 'Río Negro', label:'UGEL - Río Negro'},
    {value: 'Mazamari', label:'UGEL - Mazamari'},
    {value: 'Pangoa', label:'UGEL - Pangoa'},
    {value: 'Pichanaki', label:'UGEL - Pichanaki'},
    {value: 'Río Tambo', label:'UGEL - Río Tambo'},
    {value: 'La Merced', label:'UGEL - La Merced'},
    {value: 'Concepción', label:'UGEL - Concepción'},
    {value: 'Jauja', label:'UGEL - Jauja'},
    {value: 'Huancayo', label:'UGEL - Huancayo'},
    {value: 'Otro', label:'UGEL - Otro'},
]


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