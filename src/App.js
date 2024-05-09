import {BrowserRouter, Routes, Route, Navigate, useParams} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreteRecipePage from "./pages/CreteRecipePage";
import SearchPage from "./pages/SearchPage";
import ShowRecipePage from "./pages/ShowRecipePage";
import Header from "./components/Header";
import {useEffect, useState} from "react";
import axios from "axios";
import {getJwtAuthHeader} from "./functions";
import {dbUrl} from "./config";
import EditUserPage from "./pages/EditUserPage";
import UserPage from "./pages/UserPage";
import ShowRecipeEditPage from "./pages/ShowRecipeEditPage";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const [currentUser, setCurrentUser] = useState({})

    const ProtectedRoute = ({ children }) => {
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            axios.get(dbUrl + '/user/me', getJwtAuthHeader())
                .then((response) => {
                    setIsAuthenticated(true);
                })
                .catch((error) => {
                    setIsAuthenticated(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, []);

        if (isLoading) {
            return <div>Загрузка...</div>;
        }
        if (!isAuthenticated) {
            return <Navigate to='/login' replace />;
        }
        return children;
    };

    const PermissionRoute = ({ children }) => {
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [currentUser, setCurrentUser] = useState({});
        const [isLoading, setIsLoading] = useState(true);
        const { id } = useParams(); // Получаем ID из параметров маршрута

        useEffect(() => {
            axios.get(dbUrl + '/user/me', getJwtAuthHeader())
                .then((response) => {
                    setCurrentUser(response.data);
                    setIsAuthenticated(true); // Устанавливаем аутентификацию в true
                })
                .catch((error) => {
                    console.log(error.message);
                    setIsAuthenticated(false); // В случае ошибки устанавливаем аутентификацию в false
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, []);

        useEffect(() => {
            // Проверка роли 'admin' или совпадения ID пользователя с переданным
            if (!isLoading && (!isAuthenticated || (currentUser._id !== id && !currentUser.roles.includes('admin')))) {
                // Если пользователь не аутентифицирован или не имеет роли 'admin' и его ID не совпадает с переданным
                return <Navigate to='/search?searchRequest=' replace />;
            }
        }, [currentUser, isAuthenticated, isLoading, id]); // Зависимости эффекта

        if (isLoading) {
            return <div>Загрузка...</div>;
        }
        if (!isAuthenticated) {
            return <Navigate to='/login' replace />;
        }
        return children;
    };

    return (
      <>
          <main>
              <BrowserRouter>
                  <Header/>
                  <Routes>
                      <Route path={'/login'} element={<LoginPage/>}/>
                      <Route path={'/registration'} element={<RegisterPage/>}/>
                      <Route path={'/user/edit/:id'} element={<ProtectedRoute><PermissionRoute><EditUserPage/></PermissionRoute></ProtectedRoute>}/>
                      <Route path={'/recipe/edit/:id'} element={<ProtectedRoute><PermissionRoute><ShowRecipeEditPage/></PermissionRoute></ProtectedRoute>}/>
                      <Route path={'/createRecipe'} element={<ProtectedRoute><CreteRecipePage/></ProtectedRoute>}/>
                      <Route path={'/search'} element={<ProtectedRoute><SearchPage/></ProtectedRoute>}/>
                      <Route path={'/recipe/:id'} element={<ProtectedRoute><ShowRecipePage/></ProtectedRoute>}/>
                      <Route path={'/user/:id'} element={<ProtectedRoute><UserPage/></ProtectedRoute>}/>
                      <Route path={'*'} element={<ProtectedRoute><Navigate to={'/search?searchRequest='} replace/></ProtectedRoute>}/>
                  </Routes>
              </BrowserRouter>
          </main>
      </>
  );
}

export default App;
