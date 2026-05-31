import { UserRole } from "../entities/enum";

export interface AuthUserInterface {
    id: string;
    role: UserRole;
    organizationId: string;
}