const PORT = process.env.PORT || 4000;

const spec = {
  openapi: "3.0.0",
  info: {
    title: "TECH HUB API",
    version: "1.0.0",
    description: "Swagger documentation for all endpoints",
  },
  servers: [{ url: `http://localhost:${PORT}` }],
  tags: [
    { name: "Auth" },
    { name: "Products" },
    { name: "Orders" },
    { name: "Flags" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Product: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          image: { type: "array", items: { type: "string" } },
          seller: { type: "string" },
          isActive: { type: "boolean" },
          deliveryTime: { type: "number" },
          createdAt: { type: "string" },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          product: { type: "string" },
          title: { type: "string" },
          price: { type: "number" },
          qty: { type: "number" },
          seller: { type: "string" },
        },
      },
      BuyerInfo: {
        type: "object",
        properties: {
          name: { type: "string" },
          phone: { type: "string" },
          address: { type: "string" },
          city: { type: "string" },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          buyerUser: { type: "string" },
          buyer: { $ref: "#/components/schemas/BuyerInfo" },
          items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
          totalPrice: { type: "number" },
          status: {
            type: "string",
            enum: ["pending", "confirmed", "shipped", "delivered"],
          },
          createdAt: { type: "string" },
        },
      },
      Flag: {
        type: "object",
        properties: {
          _id: { type: "string" },
          product: { type: "string" },
          reason: { type: "string" },
          status: { type: "string", enum: ["open", "closed"] },
          createdAt: { type: "string" },
        },
      },
      Error: {
        type: "object",
        properties: { message: { type: "string" } },
      },
    },
  },

  paths: {
    /* ================= AUTH (Placeholder) =================
       ✳️ عدّلي المسارات دي لو أسماء auth routes عندك مختلفة */
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { email: { type: "string" }, password: { type: "string" } },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" } },
      },
    },
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Signup",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  role: { type: "string", enum: ["buyer", "seller", "admin"] },
                },
                required: ["name", "email", "password"],
              },
            },
          },
        },
        responses: { 201: { description: "Created" }, 400: { description: "Bad request" } },
      },
    },

    /* ================= PRODUCTS ================= */
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products (Public/Buyer)",
        responses: {
          200: {
            description: "List of products",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Add product (Seller) - multipart images[]",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  price: { type: "number" },
                  description: { type: "string" },
                  image: { type: "array", items: { type: "string", format: "binary" } },
                },
                required: ["title", "price"],
              },
            },
          },
        },
        responses: {
          201: { description: "Created" },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/products/me": {
      get: {
        tags: ["Products"],
        summary: "Get my products (Seller)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Seller products",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } },
          },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by id (Public/Buyer)",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "OK" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update product (Seller) - multipart images[]",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  price: { type: "number" },
                  description: { type: "string" },
                  image: { type: "array", items: { type: "string", format: "binary" } },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Updated" }, 401: { description: "Unauthorized" }, 404: { description: "Not found" } },
      },
    },

    "/products/seller/{id}": {
      delete: {
        tags: ["Products"],
        summary: "Delete product by seller (Seller)",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" }, 401: { description: "Unauthorized" }, 404: { description: "Not found" } },
      },
    },

    "/products/admin/{id}": {
      delete: {
        tags: ["Products"],
        summary: "Delete product by admin (Admin)",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Deleted" }, 401: { description: "Unauthorized" }, 404: { description: "Not found" } },
      },
    },

    /* ================= ORDERS ================= */
    "/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create order (Buyer)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  buyer: { $ref: "#/components/schemas/BuyerInfo" },
                  items: { type: "array", items: { $ref: "#/components/schemas/OrderItem" } },
                  totalPrice: { type: "number" },
                  paymentMethod: { type: "string" },
                },
                required: ["buyer", "items", "totalPrice"],
              },
            },
          },
        },
        responses: { 201: { description: "Created" }, 401: { description: "Unauthorized" } },
      },
    },

    "/orders/my": {
      get: {
        tags: ["Orders"],
        summary: "Get my orders (Buyer)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Buyer orders",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Order" } } } },
          },
          401: { description: "Unauthorized" },
        },
      },
    },

    "/orders/seller": {
      get: {
        tags: ["Orders"],
        summary: "Get seller orders (Seller)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Seller orders" }, 401: { description: "Unauthorized" } },
      },
    },

    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order by id (Buyer/Seller)",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" }, 401: { description: "Unauthorized" }, 404: { description: "Not found" } },
      },
    },

    "/orders/{id}/status": {
      put: {
        tags: ["Orders"],
        summary: "Update order status (Seller)",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { status: { type: "string", enum: ["pending", "confirmed", "shipped", "delivered"] } },
                required: ["status"],
              },
            },
          },
        },
        responses: { 200: { description: "Updated" }, 401: { description: "Unauthorized" }, 404: { description: "Not found" } },
      },
    },

    /* ================= FLAGS (adjust if your routes differ) ================= */
    "/flags": {
      get: {
        tags: ["Flags"],
        summary: "Get all flags",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Flags"],
        summary: "Create flag",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { product: { type: "string" }, reason: { type: "string" } },
                required: ["product", "reason"],
              },
            },
          },
        },
        responses: { 201: { description: "Created" } },
      },
    },

    "/flags/{id}": {
      get: {
        tags: ["Flags"],
        summary: "Get flag by id",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "OK" }, 404: { description: "Not found" } },
      },
      put: {
        tags: ["Flags"],
        summary: "Update flag status (ex: close)",
        security: [{ bearerAuth: [] }],
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", properties: { status: { type: "string", enum: ["open", "closed"] } }, required: ["status"] },
            },
          },
        },
        responses: { 200: { description: "Updated" }, 404: { description: "Not found" } },
      },
    },
  },
};

export default spec;
