import {AuthProvider} from "./context/AuthContext.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.tsx";
import Lessons from "./pages/Lessons.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import ReviewPage from "./pages/ReviewPage.tsx";
import {useAuth} from "./hooks/useAuth.ts";
import Layout from "./components/layout/LayOut.tsx";
import ExerciseDemoPage from "./pages/ExerciseDemoPage.tsx";
import LessonDetailPage from "./pages/LessonDetailPage.tsx";


function App() {
    const {user} = useAuth()
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        {/* Default to lessons as homepage for now */}
                        <Route index element={<Lessons/>}/>
                        <Route path="lessons" element={<Lessons/>}/>
                        <Route path="lessons/:lessonId" element={<LessonDetailPage/>}/>
                        <Route path="login" element={<LoginPage/>}/>
                        <Route path="register" element={<RegisterPage/>}/>
                        <Route path="review" element={<ReviewPage userId={user?.uid as string}/>}/>
                        <Route path="reset-password" element={<ResetPasswordPage/>}/>
                        <Route path={"demo"} element={<ExerciseDemoPage/>}/>

                        {/* Protected Routes */}
                        <Route
                            path="dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard/>
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;