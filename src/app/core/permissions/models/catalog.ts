import { PermissionAction } from "./action";
import { PermissionResource } from "./resource";

export class PermissionCatalog {
  static permissionOf(resource: string, action: string): string {
    return `Permissions.${resource}.${action}`;
  }

  static readonly Dashboard_View = PermissionCatalog.permissionOf(PermissionResource.Dashboard, PermissionAction.View);

  static readonly Users_Create = PermissionCatalog.permissionOf(PermissionResource.Users, PermissionAction.Create);
  static readonly Users_Update = PermissionCatalog.permissionOf(PermissionResource.Users, PermissionAction.Update);
  static readonly Users_Delete = PermissionCatalog.permissionOf(PermissionResource.Users, PermissionAction.Delete);
  static readonly Users_View = PermissionCatalog.permissionOf(PermissionResource.Users, PermissionAction.View);
  static readonly Users_ChangeRole = PermissionCatalog.permissionOf(PermissionResource.Users, PermissionAction.ChangeRole);

  static readonly Roles_Create = PermissionCatalog.permissionOf(PermissionResource.Roles, PermissionAction.Create);
  static readonly Roles_Update = PermissionCatalog.permissionOf(PermissionResource.Roles, PermissionAction.Update);
  static readonly Roles_Delete = PermissionCatalog.permissionOf(PermissionResource.Roles, PermissionAction.Delete);
  static readonly Roles_View = PermissionCatalog.permissionOf(PermissionResource.Roles, PermissionAction.View);

  static readonly Categories_Create = PermissionCatalog.permissionOf(PermissionResource.Categories, PermissionAction.Create);
  static readonly Categories_Update = PermissionCatalog.permissionOf(PermissionResource.Categories, PermissionAction.Update);
  static readonly Categories_Delete = PermissionCatalog.permissionOf(PermissionResource.Categories, PermissionAction.Delete);
  static readonly Categories_View = PermissionCatalog.permissionOf(PermissionResource.Categories, PermissionAction.View);

  static readonly Customers_Create = PermissionCatalog.permissionOf(PermissionResource.Customers, PermissionAction.Create);
  static readonly Customers_Update = PermissionCatalog.permissionOf(PermissionResource.Customers, PermissionAction.Update);
  static readonly Customers_Delete = PermissionCatalog.permissionOf(PermissionResource.Customers, PermissionAction.Delete);
  static readonly Customers_View = PermissionCatalog.permissionOf(PermissionResource.Customers, PermissionAction.View);

  static readonly Orders_Create = PermissionCatalog.permissionOf(PermissionResource.Orders, PermissionAction.Create);
  static readonly Orders_Update = PermissionCatalog.permissionOf(PermissionResource.Orders, PermissionAction.Update);
  static readonly Orders_Deliver = PermissionCatalog.permissionOf(PermissionResource.Orders, PermissionAction.Deliver);
  static readonly Orders_Delete = PermissionCatalog.permissionOf(PermissionResource.Orders, PermissionAction.Delete);
  static readonly Orders_View = PermissionCatalog.permissionOf(PermissionResource.Orders, PermissionAction.View);

  static readonly Products_Create = PermissionCatalog.permissionOf(PermissionResource.Products, PermissionAction.Create);
  static readonly Products_Update = PermissionCatalog.permissionOf(PermissionResource.Products, PermissionAction.Update);
  static readonly Products_Delete = PermissionCatalog.permissionOf(PermissionResource.Products, PermissionAction.Delete);
  static readonly Products_View = PermissionCatalog.permissionOf(PermissionResource.Products, PermissionAction.View);

  static readonly Suppliers_Create = PermissionCatalog.permissionOf(PermissionResource.Suppliers, PermissionAction.Create);
  static readonly Suppliers_Update = PermissionCatalog.permissionOf(PermissionResource.Suppliers, PermissionAction.Update);
  static readonly Suppliers_Delete = PermissionCatalog.permissionOf(PermissionResource.Suppliers, PermissionAction.Delete);
  static readonly Suppliers_View = PermissionCatalog.permissionOf(PermissionResource.Suppliers, PermissionAction.View);

  static readonly Units_Create = PermissionCatalog.permissionOf(PermissionResource.UnitsOfMeasurement, PermissionAction.Create);
  static readonly Units_Update = PermissionCatalog.permissionOf(PermissionResource.UnitsOfMeasurement, PermissionAction.Update);
  static readonly Units_Delete = PermissionCatalog.permissionOf(PermissionResource.UnitsOfMeasurement, PermissionAction.Delete);
  static readonly Units_View = PermissionCatalog.permissionOf(PermissionResource.UnitsOfMeasurement, PermissionAction.View);

  static readonly Purchases_Create = PermissionCatalog.permissionOf(PermissionResource.Purchases, PermissionAction.Create);
  static readonly Purchases_Update = PermissionCatalog.permissionOf(PermissionResource.Purchases, PermissionAction.Update);
  static readonly Purchases_Delete = PermissionCatalog.permissionOf(PermissionResource.Purchases, PermissionAction.Delete);
  static readonly Purchases_View = PermissionCatalog.permissionOf(PermissionResource.Purchases, PermissionAction.View);
  static readonly Purchases_Receive = PermissionCatalog.permissionOf(PermissionResource.Purchases, PermissionAction.Receive);
};
