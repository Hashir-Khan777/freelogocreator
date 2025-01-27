import layout from "./layout.js";
import todo from "../pages/app/todo/store.js";
import email from "../pages/app/email/store.js";
import chat from "../pages/app/chat/store.js";
import project from "../pages/app/projects/store.js";
import kanban from "../pages/app/kanban/store.js";
import auth from "./api/auth/authSlice.js";
import cart from "./api/shop/cartSlice.js";
import authentication from "./reducers/auth.js";
import course from "./reducers/course.js";
import topic from "./reducers/topic.js";
import logos from "./reducers/logos.js";
import categories from "./reducers/categories.js";
import users from "./reducers/user.js";
import packages from "./reducers/packages.js";
import subscriptions from "./reducers/subscriptions.js";
import queries from "./reducers/queries.js";
import logs from "./reducers/logs.js";

const rootReducer = {
  layout,
  todo,
  email,
  chat,
  project,
  kanban,
  auth,
  authentication,
  cart,
  course,
  topic,
  logos,
  categories,
  users,
  packages,
  subscriptions,
  queries,
  logs,
};
export default rootReducer;
