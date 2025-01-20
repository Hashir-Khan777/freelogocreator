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
};
export default rootReducer;
