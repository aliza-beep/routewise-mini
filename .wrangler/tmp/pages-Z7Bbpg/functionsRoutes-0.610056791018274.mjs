import { onRequestGet as __api_news_js_onRequestGet } from "C:\\Users\\Aliza Sharif\\Documents\\GitHub\\routewise-mini\\functions\\api\\news.js"

export const routes = [
    {
      routePath: "/api/news",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_news_js_onRequestGet],
    },
  ]