import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardList,
  Home,
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  Store,
  Trash2,
  UserCircle2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// ── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  shopName: string;
  name: string;
  description: string;
  price: number;
}

interface Order {
  id: number;
  productId: number;
  productName: string;
  shopName: string;
  customerName: string;
  phone: string;
  address: string;
  status: "Pending" | "Confirmed" | "Delivered";
}

// ── Seed Data ────────────────────────────────────────────────────────────────

const SEED_PRODUCTS: Product[] = [
  {
    id: 1,
    shopName: "Ramesh General Store",
    name: "Pure Desi Ghee",
    description: "Fresh cow ghee, made locally every week. 500g jar.",
    price: 320,
  },
  {
    id: 2,
    shopName: "Savita Vegetables",
    name: "Organic Tomatoes",
    description: "Farm-fresh tomatoes picked this morning. 1 kg pack.",
    price: 40,
  },
  {
    id: 3,
    shopName: "Mohan Dairy",
    name: "Buffalo Milk",
    description: "Pure buffalo milk delivered daily. 1 litre pouch.",
    price: 65,
  },
  {
    id: 4,
    shopName: "Lakshmi Kirana",
    name: "Basmati Rice (5 kg)",
    description: "Premium basmati rice, perfect fragrance and taste.",
    price: 380,
  },
];

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const shortPrincipal = isLoggedIn
    ? `${identity.getPrincipal().toString().slice(0, 5)}...`
    : null;

  const [activeTab, setActiveTab] = useState("home");

  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [nextProductId, setNextProductId] = useState(5);
  const [nextOrderId, setNextOrderId] = useState(1);

  // Order dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Add product form state
  const [newShopName, setNewShopName] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");

  function openOrderDialog(product: Product) {
    setSelectedProduct(product);
    setCustomerName("");
    setPhone("");
    setAddress("");
    setDialogOpen(true);
  }

  function handlePlaceOrder() {
    if (!selectedProduct) return;
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const newOrder: Order = {
      id: nextOrderId,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      shopName: selectedProduct.shopName,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      status: "Pending",
    };

    setOrders((prev) => [...prev, newOrder]);
    setNextOrderId((n) => n + 1);
    setDialogOpen(false);
    toast.success(
      `Order placed for ${selectedProduct.name}! Pay with Cash on Delivery.`,
    );
  }

  function handleAddProduct() {
    if (
      !newShopName.trim() ||
      !newProductName.trim() ||
      !newDescription.trim() ||
      !newPrice.trim()
    ) {
      toast.error("Please fill in all product fields.");
      return;
    }
    const price = Number.parseFloat(newPrice);
    if (Number.isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    const product: Product = {
      id: nextProductId,
      shopName: newShopName.trim(),
      name: newProductName.trim(),
      description: newDescription.trim(),
      price,
    };
    setProducts((prev) => [...prev, product]);
    setNextProductId((n) => n + 1);
    setNewShopName("");
    setNewProductName("");
    setNewDescription("");
    setNewPrice("");
    toast.success(`${product.name} added to the bazaar!`);
  }

  function handleDeleteProduct(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product removed.");
  }

  function handleStatusChange(orderId: number, status: Order["status"]) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
  }

  const statusColor: Record<Order["status"], string> = {
    Pending: "bg-amber-100 text-amber-800 border-amber-200",
    Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    Delivered: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(var(--background))" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card shadow-xs">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "oklch(var(--accent))" }}
          >
            <ShoppingBag
              className="w-5 h-5"
              style={{ color: "oklch(var(--accent-foreground))" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1
              className="font-display text-xl font-bold leading-tight"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Gaushala Bazaar
            </h1>
            <p
              className="text-xs"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Your village market
            </p>
          </div>

          {/* Auth controls */}
          {isInitializing ? null : isLoggedIn ? (
            <div className="flex items-center gap-2 shrink-0">
              <div
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 border border-border"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                <UserCircle2 className="w-3.5 h-3.5" />
                {shortPrincipal}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs h-8"
                onClick={() => {
                  clear();
                  toast.success("Logged out successfully.");
                }}
                data-ocid="header.logout_button"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5 text-xs h-8"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="header.login_button"
            >
              <UserCircle2 className="w-3.5 h-3.5" />
              {isLoggingIn ? "Logging in…" : "Shop Owner Login"}
            </Button>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-6 h-11">
            <TabsTrigger
              value="home"
              className="flex-1 gap-2"
              data-ocid="nav.home_tab"
            >
              <Home className="w-4 h-4" />
              Home
            </TabsTrigger>
            <TabsTrigger
              value="shop"
              className="flex-1 gap-2"
              data-ocid="nav.shop_tab"
            >
              <Store className="w-4 h-4" />
              Shop
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="flex-1 gap-2"
              data-ocid="nav.manage_tab"
            >
              <Package className="w-4 h-4" />
              Manage
            </TabsTrigger>
          </TabsList>

          {/* ── Home Tab ── */}
          <TabsContent value="home" className="space-y-8">
            {/* Hero Section */}
            <section
              className="rounded-2xl px-6 py-10 text-center relative overflow-hidden"
              style={{ background: "oklch(var(--primary))" }}
              data-ocid="home.section"
            >
              {/* Decorative circles */}
              <div
                className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20"
                style={{ background: "oklch(var(--accent))" }}
              />
              <div
                className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full opacity-10"
                style={{ background: "oklch(var(--accent))" }}
              />

              <div className="relative z-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "oklch(var(--accent))" }}
                >
                  <ShoppingBag
                    className="w-8 h-8"
                    style={{ color: "oklch(var(--accent-foreground))" }}
                  />
                </div>
                <h2
                  className="font-display text-3xl font-bold mb-2 leading-tight"
                  style={{ color: "oklch(var(--primary-foreground))" }}
                >
                  Gaushala Bazaar
                </h2>
                <p
                  className="text-base mb-1 font-medium"
                  style={{ color: "oklch(0.85 0.04 90)" }}
                >
                  आपका अपना गांव का बाजार
                </p>
                <p
                  className="text-sm max-w-xs mx-auto leading-relaxed mt-3"
                  style={{ color: "oklch(0.80 0.03 90)" }}
                >
                  Fresh products from local shops in your village — browse,
                  order, and pay at your doorstep.
                </p>
                <Button
                  className="mt-6 gap-2 font-semibold px-8 h-11"
                  onClick={() => setActiveTab("shop")}
                  data-ocid="home.browse_button"
                  style={{
                    background: "oklch(var(--accent))",
                    color: "oklch(var(--accent-foreground))",
                  }}
                >
                  <Store className="w-4 h-4" />
                  Browse Products
                </Button>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-2 gap-4">
              <Card
                className="border border-border text-center"
                data-ocid="home.card"
              >
                <CardContent className="pt-5 pb-5">
                  <p
                    className="font-display text-4xl font-bold"
                    style={{ color: "oklch(var(--primary))" }}
                  >
                    {products.length}
                  </p>
                  <p
                    className="text-sm font-medium mt-1"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    Products Available
                  </p>
                </CardContent>
              </Card>
              <Card
                className="border border-border text-center"
                data-ocid="home.card"
              >
                <CardContent className="pt-5 pb-5">
                  <p
                    className="font-display text-4xl font-bold"
                    style={{ color: "oklch(var(--accent))" }}
                  >
                    {new Set(products.map((p) => p.shopName)).size}
                  </p>
                  <p
                    className="text-sm font-medium mt-1"
                    style={{ color: "oklch(var(--muted-foreground))" }}
                  >
                    Local Shops
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* How It Works */}
            <section>
              <h3
                className="font-display text-lg font-semibold mb-4 text-center"
                style={{ color: "oklch(var(--foreground))" }}
              >
                How It Works
              </h3>
              <div className="space-y-3">
                {[
                  {
                    step: "1",
                    title: "Browse Local Products",
                    desc: "Explore fresh vegetables, dairy, groceries, and more from shops in your village.",
                    icon: "🛒",
                  },
                  {
                    step: "2",
                    title: "Place Your Order",
                    desc: "Fill in your name, phone number, and delivery address — takes less than a minute.",
                    icon: "📋",
                  },
                  {
                    step: "3",
                    title: "Pay Cash on Delivery",
                    desc: "No online payment needed. Pay the shopkeeper when you receive your order.",
                    icon: "💵",
                  },
                ].map(({ step, title, desc, icon }) => (
                  <div
                    key={step}
                    className="flex items-start gap-4 rounded-xl border border-border bg-card px-4 py-4"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg"
                      style={{ background: "oklch(var(--secondary))" }}
                    >
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-xs font-bold uppercase tracking-wide"
                          style={{ color: "oklch(var(--accent))" }}
                        >
                          Step {step}
                        </span>
                      </div>
                      <p className="font-semibold text-sm">{title}</p>
                      <p
                        className="text-xs mt-0.5 leading-relaxed"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* ── Shop Tab ── */}
          <TabsContent value="shop">
            <h2
              className="font-display text-lg font-semibold mb-4"
              style={{ color: "oklch(var(--foreground))" }}
            >
              Available Products
            </h2>
            {products.length === 0 ? (
              <div
                className="text-center py-16 rounded-lg border border-dashed border-border"
                data-ocid="product.empty_state"
              >
                <ShoppingBag
                  className="w-10 h-10 mx-auto mb-3"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                />
                <p
                  className="font-medium"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  No products yet
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  Visit the Manage tab to add products.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {products.map((product, idx) => (
                  <Card
                    key={product.id}
                    data-ocid={`product.item.${idx + 1}`}
                    className="border border-border"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base font-semibold leading-snug">
                          {product.name}
                        </CardTitle>
                        <span
                          className="font-display text-lg font-bold shrink-0"
                          style={{ color: "oklch(var(--primary))" }}
                        >
                          ₹{product.price}
                        </span>
                      </div>
                      <Badge variant="secondary" className="w-fit text-xs">
                        {product.shopName}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p
                        className="text-sm"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                      >
                        {product.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        className="w-full"
                        data-ocid={`product.order_button.${idx + 1}`}
                        onClick={() => openOrderDialog(product)}
                        style={{
                          background: "oklch(var(--primary))",
                          color: "oklch(var(--primary-foreground))",
                        }}
                      >
                        Order Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Manage Tab ── */}
          <TabsContent value="manage" className="space-y-8">
            {/* Lock screen when not logged in */}
            {!isLoggedIn && (
              <div
                className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl border border-dashed border-border"
                data-ocid="manage.login_prompt"
                style={{ background: "oklch(var(--card))" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background: "oklch(var(--accent) / 0.15)" }}
                >
                  <Lock
                    className="w-8 h-8"
                    style={{ color: "oklch(var(--accent))" }}
                  />
                </div>
                <h2
                  className="font-display text-xl font-bold mb-2"
                  style={{ color: "oklch(var(--foreground))" }}
                >
                  Shop Owner Area
                </h2>
                <p
                  className="text-sm mb-8 max-w-xs leading-relaxed"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  Log in with Internet Identity to manage your products and
                  orders.
                </p>
                <Button
                  className="w-full max-w-xs gap-2"
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid="manage.login_button"
                  style={{
                    background: "oklch(var(--primary))",
                    color: "oklch(var(--primary-foreground))",
                  }}
                >
                  <UserCircle2 className="w-4 h-4" />
                  {isLoggingIn ? "Logging in…" : "Login as Shop Owner"}
                </Button>
              </div>
            )}

            {/* Owner-only content */}
            {isLoggedIn && (
              <>
                {/* Add Product */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Package
                      className="w-5 h-5"
                      style={{ color: "oklch(var(--primary))" }}
                    />
                    <h2 className="font-display text-lg font-semibold">
                      Add Product
                    </h2>
                  </div>
                  <Card className="border border-border">
                    <CardContent className="pt-5 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="shop-name">Shop Name</Label>
                          <Input
                            id="shop-name"
                            placeholder="e.g. Ramesh General Store"
                            value={newShopName}
                            onChange={(e) => setNewShopName(e.target.value)}
                            data-ocid="manage.shop_input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="product-name">Product Name</Label>
                          <Input
                            id="product-name"
                            placeholder="e.g. Pure Desi Ghee"
                            value={newProductName}
                            onChange={(e) => setNewProductName(e.target.value)}
                            data-ocid="manage.product_input"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          placeholder="Brief description of the product"
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          data-ocid="manage.description_input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="e.g. 150"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          data-ocid="manage.price_input"
                          min="1"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleAddProduct}
                        data-ocid="manage.add_button"
                        style={{
                          background: "oklch(var(--primary))",
                          color: "oklch(var(--primary-foreground))",
                        }}
                      >
                        Add Product
                      </Button>
                    </CardContent>
                  </Card>
                </section>

                <Separator />

                {/* Products List */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Store
                      className="w-5 h-5"
                      style={{ color: "oklch(var(--primary))" }}
                    />
                    <h2 className="font-display text-lg font-semibold">
                      Products List
                    </h2>
                    <Badge variant="secondary" className="ml-auto">
                      {products.length}
                    </Badge>
                  </div>
                  {products.length === 0 ? (
                    <p
                      className="text-sm py-4 text-center"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      No products added yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {products.map((product, idx) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {product.name}
                            </p>
                            <p
                              className="text-xs truncate"
                              style={{
                                color: "oklch(var(--muted-foreground))",
                              }}
                            >
                              {product.shopName} · ₹{product.price}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            data-ocid={`manage.delete_button.${idx + 1}`}
                            onClick={() => handleDeleteProduct(product.id)}
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <Separator />

                {/* Orders List */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <ClipboardList
                      className="w-5 h-5"
                      style={{ color: "oklch(var(--primary))" }}
                    />
                    <h2 className="font-display text-lg font-semibold">
                      Orders
                    </h2>
                    <Badge variant="secondary" className="ml-auto">
                      {orders.length}
                    </Badge>
                  </div>
                  {orders.length === 0 ? (
                    <p
                      className="text-sm py-4 text-center"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      No orders yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order, idx) => (
                        <Card key={order.id} className="border border-border">
                          <CardContent className="pt-4 pb-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-sm">
                                  {order.productName}
                                </p>
                                <p
                                  className="text-xs"
                                  style={{
                                    color: "oklch(var(--muted-foreground))",
                                  }}
                                >
                                  {order.shopName}
                                </p>
                              </div>
                              <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor[order.status]}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div
                              className="text-sm space-y-0.5"
                              style={{
                                color: "oklch(var(--muted-foreground))",
                              }}
                            >
                              <p>
                                <span className="font-medium text-foreground">
                                  {order.customerName}
                                </span>{" "}
                                · {order.phone}
                              </p>
                              <p className="text-xs">{order.address}</p>
                            </div>
                            <div className="pt-1">
                              <Select
                                value={order.status}
                                onValueChange={(val) =>
                                  handleStatusChange(
                                    order.id,
                                    val as Order["status"],
                                  )
                                }
                              >
                                <SelectTrigger
                                  className="h-8 text-xs"
                                  data-ocid={
                                    idx === 0
                                      ? "manage.status_select.1"
                                      : undefined
                                  }
                                >
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="Confirmed">
                                    Confirmed
                                  </SelectItem>
                                  <SelectItem value="Delivered">
                                    Delivered
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Order Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md" data-ocid="order.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Place Your Order</DialogTitle>
            <DialogDescription>
              {selectedProduct && (
                <>
                  <strong>{selectedProduct.name}</strong> from{" "}
                  {selectedProduct.shopName} — ₹{selectedProduct.price}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="order-name">Your Name</Label>
              <Input
                id="order-name"
                placeholder="Full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                data-ocid="order.name_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order-phone">Phone Number</Label>
              <Input
                id="order-phone"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                data-ocid="order.phone_input"
                type="tel"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order-address">Delivery Address</Label>
              <Textarea
                id="order-address"
                placeholder="House number, street, village name..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                data-ocid="order.address_input"
                rows={3}
              />
            </div>
            <div
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium"
              style={{
                background: "oklch(var(--accent) / 0.15)",
                color: "oklch(var(--foreground))",
              }}
            >
              💵 Payment:{" "}
              <span className="font-semibold">Cash on Delivery (COD)</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="order.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlaceOrder}
              data-ocid="order.submit_button"
              style={{
                background: "oklch(var(--primary))",
                color: "oklch(var(--primary-foreground))",
              }}
            >
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center">
        <p
          className="text-xs"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster richColors position="top-center" />
    </div>
  );
}
