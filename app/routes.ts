import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // صفحه اصلی (لندینگ پیج)
  index("routes/home.tsx"),

  // مسیر اپلیکیشن چت
  route("chat", "routes/chat.tsx"),
] satisfies RouteConfig;