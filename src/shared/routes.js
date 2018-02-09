import Home from "./home";
import News from "./news";
import Post from './post';

const routes = [
  {
    path: "/",
    exact: true,
    component: Home
  },
  {
    path: "/news",
    component: News
  },
  {
    path: '/post',
    component: Post
  }
];

export default routes;
