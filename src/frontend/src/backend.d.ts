import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Officer {
    name: string;
    mobileNumber: string;
}
export interface backendInterface {
    addOrUpdateOfficer(name: string, mobileNumber: string): Promise<void>;
    getMessagePayload(officerName: string, message: string): Promise<{
        mobileNumber: string;
        message: string;
    }>;
    getOfficers(): Promise<Array<Officer>>;
    initAdmin(): Promise<void>;
    isAdmin(principal: Principal): Promise<boolean>;
    /**
     * / Register caller as admin if no admin exists.
     */
    registerAsAdmin(): Promise<void>;
    removeOfficer(name: string): Promise<void>;
}
