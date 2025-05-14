import type { Permission } from "@/interfaces/interfaces";

export type Role = {
   _id: string,
   name: string,
   permissions: string[] | Permission[],
}

export type AddRole = Omit<Role, '_id'>