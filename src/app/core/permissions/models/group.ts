export interface PermissionDefinition {
  order: number;
  resource: string;
  action: string;
  description: string;
  required: boolean;
};

export interface PermissionResourceGroup {
  order: number;
  name: string;
  actions: PermissionDefinition[];
};

