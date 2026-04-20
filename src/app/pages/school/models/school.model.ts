export type Management = 'Pública' | 'Privada';
export type Ugel = 'Satipo' | 'Rio Negro' | 'Mazamari' | 'Pangoa' | 'Pichanaki' | 'Rio Tambo' | 'La Merced' | 'Concepcion' | 'Jauja' | 'Huancayo' | 'Otro';


export const MANAGEMENT_OPTIONS: {value: Management, label: Management}[] = [
    {value: 'Pública', label:'Pública'},
    {value: 'Privada', label:'Privada'},
];

export const UGEL: {value: Ugel, label: string}[] = [
    {value: 'Satipo', label:'UGEL - Satipo'},
    {value: 'Rio Negro', label:'UGEL - Rio Negro'},
    {value: 'Mazamari', label:'UGEL - Mazamari'},
    {value: 'Pangoa', label:'UGEL - Pangoa'},
    {value: 'Pichanaki', label:'UGEL - Pichanaki'},
    {value: 'Rio Tambo', label:'UGEL - Rio Tambo'},
    {value: 'La Merced', label:'UGEL - La Merced'},
    {value: 'Concepcion', label:'UGEL - Concepcion'},
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
    ugel?: string | null;
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
    ugel?: string | null;
    headmasterId: number;
    deputyDirectorId?: number | null;
}