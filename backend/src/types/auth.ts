export interface IAuthDocument {
    id?: number;
    profilePublicId?: string;
    username?: string;
    email?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
  }
  