import { Navigate, Route, Routes } from 'react-router-dom';
import Admin from './components/admin/Admin';
import AdminTableBlogs from './components/admin/admin-tables/AdminTableBlogs';
import AdminTableCategories from './components/admin/admin-tables/AdminTableCategories';
import AdminTableDefault from './components/admin/admin-tables/AdminTableDefault';
import AdminTableUsers from './components/admin/admin-tables/AdminTableUsers';
import Authenticate from './components/auth/authenticate/Authenticate';
import Login from './components/auth/login/Login';
import Logout from './components/auth/logout/Logout';
import Register from './components/auth/register/Register';
import Blog from './components/blog/Blog';
import BlogCreate from './components/blog/blog-create/BlogCreate';
import SingleBlog from './components/blog/single-blog/SingleBlog';
import AlertBox from './components/common/alert-box/AlertBox';
import Footer from './components/common/footer/Footer';
import Header from './components/common/header/Header';
import ProtectedRoute from './components/common/protected-route/ProtectedRoute';
import ContactUs from './components/contact-us/ContactUs';
import Courses from './components/courses/Courses';
import ErrorBoundary from './components/error-boundary/ErrorBoundary';
import Home from './components/home/Home';
import HttpProvider from './components/http-provider/HttpProvider';
import NotFound from './components/not-found/NotFound';
import Quizzes from './components/quizzes/Quizzes';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorProvider } from './contexts/ErrorContext';
import './styles/style.scss';
import { AdminPagesEnum } from './types/enums/AdminPagesEnum';
import { PagesEnum } from './types/enums/PagesEnum';

function App() {
  return (
    <>
      <ErrorBoundary>
        <ErrorProvider>
          <AuthProvider>
            <HttpProvider>
              <Authenticate>
                <AlertBox />
                <Header />
                <Routes>
                  {/* Everyone */}
                  <Route path={PagesEnum.Home} element={<Home />} />
                  <Route path={PagesEnum.Courses} element={<Courses />} />
                  <Route path={PagesEnum.Blog} element={<Blog />} />
                  <Route path={PagesEnum.SingleBlog} element={<SingleBlog />} />
                  <Route path={PagesEnum.Contact} element={<ContactUs />} />
                  <Route path={PagesEnum.NotFound} element={<NotFound />} />

                  {/* Only guests */}
                  <Route element={<ProtectedRoute onlyUser={false} />}>
                    <Route path={PagesEnum.Login} element={<Login />} />
                    <Route path={PagesEnum.Register} element={<Register />} />
                  </Route>

                  {/* Only logged users */}
                  <Route element={<ProtectedRoute onlyUser={true} />}>
                    <Route path={PagesEnum.Logout} element={<Logout />} />
                    <Route path={PagesEnum.Quizzes} element={<Quizzes />} />
                    <Route
                      path={PagesEnum.BlogCreate}
                      element={<BlogCreate />}
                    />

                    {/* Admin does it's own auth check on load */}
                    <Route path={PagesEnum.Admin} element={<Admin />}>
                      <Route index element={<AdminTableDefault />} />
                      <Route
                        path={AdminPagesEnum.USERS}
                        element={<AdminTableUsers />}
                      />
                      <Route
                        path={AdminPagesEnum.CATEGORIES}
                        element={<AdminTableCategories />}
                      />
                      <Route
                        path={AdminPagesEnum.BLOGS}
                        element={<AdminTableBlogs />}
                      />
                      <Route
                        path="*"
                        element={<Navigate to={PagesEnum.NotFound} />}
                      />
                    </Route>
                  </Route>

                  <Route
                    path="*"
                    element={<Navigate to={PagesEnum.NotFound} />}
                  />
                </Routes>
              </Authenticate>
            </HttpProvider>
          </AuthProvider>
        </ErrorProvider>
        <Footer />
      </ErrorBoundary>
    </>
  );
}

export default App;
