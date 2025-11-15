import {AuthProvider} from "./context/AuthContext.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import Lessons from "./pages/Lessons.tsx";
import LessonDetail from "./pages/LessonDetail.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ReviewPage from "./pages/ReviewPage.tsx";
import {useAuth} from "./hooks/useAuth.ts";


function App() {
    const {user} = useAuth()
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/*<Route path="/" element={<Layout/>}>*/}
                    <Route path="lessons" element={<Lessons/>}/>
                    <Route path="lessons/:lessonId" element={<LessonDetail/>}/>
                    <Route path="login" element={<LoginPage/>}/>
                    <Route path="register" element={<RegisterPage/>}/>
                    <Route path="review" element={<ReviewPage/>}/>
                    <Route path="reset-password" element={<ResetPasswordPage/>}/>

                    {/* Protected Routes */}
                    <Route
                        path="dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard/>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;