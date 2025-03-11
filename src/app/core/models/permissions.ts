export class Resource {
    static readonly Dashboard = "Dashboard";
    static readonly Users = "Users";
    static readonly Roles = "Roles";
    static readonly UnitsOfMeasurement = "UnitsOfMeasurement";
    static readonly Categories = "Categories";
    static readonly Suppliers = "Suppliers";
    static readonly Customers = "Customers";
    static readonly Products = "Products";
    static readonly Purchases = "Purchases";
    static readonly Orders = "Orders";
}

export class Action {
    static readonly View = "View";
    static readonly Search = "Search";
    static readonly Create = "Create";
    static readonly Update = "Update";
    static readonly Delete = "Delete";
    static readonly Export = "Export";
    static readonly Generate = "Generate";
    static readonly Clean = "Clean";
    static readonly ChangeRole = "ChangeRole";
    static readonly Deliver = "Deliver";
    static readonly Receive = "Receive";
}

export class Permissions {
    static permissionOf(resource: string, action: string): string {
        return `Permissions.${resource}.${action}`;
    }


    static readonly Dashboard_View = Permissions.permissionOf(Resource.Dashboard, Action.View);
    
    static readonly Users_Create = Permissions.permissionOf(Resource.Users, Action.Create);
    static readonly Users_Update = Permissions.permissionOf(Resource.Users, Action.Update);
    static readonly Users_Delete = Permissions.permissionOf(Resource.Users, Action.Delete);
    static readonly Users_View = Permissions.permissionOf(Resource.Users, Action.View);
    static readonly Users_ChangeRole = Permissions.permissionOf(Resource.Users, Action.ChangeRole);

    static readonly Roles_Create = Permissions.permissionOf(Resource.Roles, Action.Create);
    static readonly Roles_Update = Permissions.permissionOf(Resource.Roles, Action.Update);
    static readonly Roles_Delete = Permissions.permissionOf(Resource.Roles, Action.Delete);
    static readonly Roles_View = Permissions.permissionOf(Resource.Roles, Action.View);

    static readonly Categories_Create = Permissions.permissionOf(Resource.Categories, Action.Create);
    static readonly Categories_Update = Permissions.permissionOf(Resource.Categories, Action.Update);
    static readonly Categories_Delete = Permissions.permissionOf(Resource.Categories, Action.Delete);
    static readonly Categories_View = Permissions.permissionOf(Resource.Categories, Action.View);

    static readonly Customers_Create = Permissions.permissionOf(Resource.Customers, Action.Create);
    static readonly Customers_Update = Permissions.permissionOf(Resource.Customers, Action.Update);
    static readonly Customers_Delete = Permissions.permissionOf(Resource.Customers, Action.Delete);
    static readonly Customers_View = Permissions.permissionOf(Resource.Customers, Action.View);

    static readonly Orders_Create = Permissions.permissionOf(Resource.Orders, Action.Create);
    static readonly Orders_Update = Permissions.permissionOf(Resource.Orders, Action.Update);
    static readonly Orders_Deliver = Permissions.permissionOf(Resource.Orders, Action.Deliver);
    static readonly Orders_Delete = Permissions.permissionOf(Resource.Orders, Action.Delete);
    static readonly Orders_View = Permissions.permissionOf(Resource.Orders, Action.View);

    static readonly Products_Create = Permissions.permissionOf(Resource.Products, Action.Create);
    static readonly Products_Update = Permissions.permissionOf(Resource.Products, Action.Update);
    static readonly Products_Delete = Permissions.permissionOf(Resource.Products, Action.Delete);
    static readonly Products_View = Permissions.permissionOf(Resource.Products, Action.View);

    static readonly Suppliers_Create = Permissions.permissionOf(Resource.Suppliers, Action.Create);
    static readonly Suppliers_Update = Permissions.permissionOf(Resource.Suppliers, Action.Update);
    static readonly Suppliers_Delete = Permissions.permissionOf(Resource.Suppliers, Action.Delete);
    static readonly Suppliers_View = Permissions.permissionOf(Resource.Suppliers, Action.View);

    static readonly Units_Create = Permissions.permissionOf(Resource.UnitsOfMeasurement, Action.Create);
    static readonly Units_Update = Permissions.permissionOf(Resource.UnitsOfMeasurement, Action.Update);
    static readonly Units_Delete = Permissions.permissionOf(Resource.UnitsOfMeasurement, Action.Delete);
    static readonly Units_View = Permissions.permissionOf(Resource.UnitsOfMeasurement, Action.View);

    static readonly Purchases_Create = Permissions.permissionOf(Resource.Purchases, Action.Create);
    static readonly Purchases_Update = Permissions.permissionOf(Resource.Purchases, Action.Update);
    static readonly Purchases_Delete = Permissions.permissionOf(Resource.Purchases, Action.Delete);
    static readonly Purchases_View   = Permissions.permissionOf(Resource.Purchases, Action.View);
    static readonly Purchases_Receive = Permissions.permissionOf(Resource.Purchases, Action.Receive);  
}