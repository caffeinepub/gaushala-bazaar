import Array "mo:core/Array";
import Bool "mo:core/Bool";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  public type Product = {
    id : Nat;
    shopName : Text;
    name : Text;
    description : Text;
    price : Nat;
    available : Bool;
  };

  public type Order = {
    id : Nat;
    productId : Nat;
    productName : Text;
    shopName : Text;
    customerName : Text;
    phone : Text;
    address : Text;
    status : Text;
  };

  var nextProductId = 1;
  var nextOrderId = 1;

  var products = List.empty<Product>();
  var orders = List.empty<Order>();

  public shared ({ caller }) func addProduct(shopName : Text, name : Text, description : Text, price : Nat) : async Nat {
    let product : Product = {
      id = nextProductId;
      shopName;
      name;
      description;
      price;
      available = true;
    };
    products.add(product);
    nextProductId += 1;
    product.id;
  };

  public query ({ caller }) func getProducts() : async [Product] {
    products.toArray();
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async Bool {
    let existingProducts = products.filter(func(p) { p.id == id });
    if (existingProducts.isEmpty()) { Runtime.trap("Product does not exist") };

    products := products.filter(func(p) { p.id != id });
    true;
  };

  public shared ({ caller }) func placeOrder(productId : Nat, customerName : Text, phone : Text, address : Text) : async Nat {
    let productOpt = products.toArray().find(func(p) { p.id == productId });
    let product = switch (productOpt) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?prod) { prod };
    };

    if (not product.available) { Runtime.trap("Product is not available") };

    let order : Order = {
      id = nextOrderId;
      productId;
      productName = product.name;
      shopName = product.shopName;
      customerName;
      phone;
      address;
      status = "pending";
    };

    orders.add(order);
    nextOrderId += 1;
    order.id;
  };

  public query ({ caller }) func getOrders() : async [Order] {
    orders.toArray();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async Bool {
    let existingOrders = orders.filter(func(o) { o.id == orderId });
    if (existingOrders.isEmpty()) { Runtime.trap("Order does not exist") };

    let updatedOrders = orders.toArray().map(
      func(o) {
        if (o.id == orderId) {
          {
            o with
            status
          };
        } else {
          o;
        };
      }
    );

    orders.clear();
    orders.addAll(updatedOrders.values());
    true;
  };
};
