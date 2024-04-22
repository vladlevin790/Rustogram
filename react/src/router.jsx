import {createBrowserRouter, Navigate} from "react-router-dom";
import DefaultLayout from "./Layouts/DefaultLayout";
import GuestLayout from "./Layouts/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Register.jsx";
import UserMain from "./views/UserMain.jsx";
import Search from "./views/Search.jsx";
import Explore from "./views/Explore.jsx";
import Recommendations from "./views/Recommendations.jsx";
import Shorts from "./views/Shorts.jsx";
import Messages from "./views/Messages.jsx";
import Profile from "./views/Profile.jsx";
import CreationPost from "./views/CreationPost.jsx";
import InsertUpdateUser from "./views/InsertUpdateUser.jsx";
import AnotherUserProfile from "./views/AnotherUserProfile.jsx";
import PasswordReset from "./views/PasswordReset.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/',
        element: <Navigate to="/user_main"/>
      },
      {
        path: '/user_main',
        element: <UserMain/>
      },
      {
        path: '/user_insert_update',
        element: <InsertUpdateUser />
      },
      {
        path: '/search',
        element: <Search/>
      },
      {
        path: '/explore',
        element: <Explore/>
      },
      {
        path: '/recommendations',
        element: <Recommendations/>
      },
      {
        path: '/shorts',
        element: <Shorts/>
      },
      {
        path: '/messages',
        element: <Messages/>
      },
      {
        path: '/profile',
        element: <Profile/>
      },
      {
        path: '/user_profile/:userId',
        element: <AnotherUserProfile />,
      },
      {
        path: 'create_post',
        element: <CreationPost/>
      }
    ]
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <Signup/>
      },
      {
        path: '/password_reset',
        element: <PasswordReset/>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
]);

export default router;
