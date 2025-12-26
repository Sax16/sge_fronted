export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  dni: number;
  ruc: number;
  gender: 'MALE' | 'FEMALE';
  birthDate: Date;
  address: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  position: string; 
  createdAt: Date;
}