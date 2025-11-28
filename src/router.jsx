import { Routes, Route } from 'react-router-dom';
import StudentProfile from './pages/student-profile/index.jsx';
import TeacherProfile from './pages/teacher-profile/index.jsx';
import Navbar from './components/navbar.jsx';
import CourseDetail from "./pages/student-profile/course-view/index.jsx";
import QuestionDetail from "./pages/student-profile/course-view/question/index.jsx";
import CreateCourse from "./pages/teacher-profile/create-course/index.jsx";
import TeacherCourseView from "./pages/teacher-profile/course-view/index.jsx";
import CreateQuestion from "./pages/teacher-profile/course-view/create-question/index.jsx";
import QuestionView from "./pages/teacher-profile/course-view/question-view/index.jsx";
import AnswersView from "./pages/teacher-profile/course-view/question-view/answers-view/index.jsx";
import CreateGuideline from "./pages/teacher-profile/course-view/create-question/create-guideline/index.jsx";
import AdminProfile from "./pages/admin-profile/index.jsx";
import FacultyPage from "./pages/admin-profile/faculty/index.jsx";
import AdminCourse from "./pages/admin-profile/faculty/course/index.jsx";
import TeacherProfileAdmin from "./pages/admin-profile/teacher";

import Howitworks from "./pages/Howitworks";
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import Pricing from './pages/Pricing.jsx';
import FAQ from './pages/FAQ.jsx';

import Home from './pages/home.jsx';
import Register from './pages/register.jsx';
import ColorGuide from './pages/color-guide.jsx';
import Login from './pages/Login.jsx';
import Footer from './components/footer.jsx';
import TermsAndConditions from './pages/legal/terms&conditions.jsx';
import PrivacyPolicy from './pages/legal/privacy.jsx';
import CookiesPolicy from './pages/legal/cookies.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import RequireRole from './components/RequiredRole.jsx';

import Calendar from './pages/teacher-profile/Calendar.jsx';
import Purchase from './pages/payments/purchase.jsx';
import Checkout from './pages/payments/checkout.jsx';
import PaymentsHistoryPage from './pages/payments/history.jsx';

export default function Router() {
  return (
    <>
      <Navbar />
      {/* contenedor que asegura que el footer quede al final */}
      <div className="flex flex-col min-h-screen">
        <div className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/colors" element={<ColorGuide />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/calendar" element={<Calendar />} />

            {/*Rutas Admin*/}
            <Route path="/admin-profile" element={<AdminProfile />} />
            <Route path="/admin-profile/faculty/:id" element={<FacultyPage />} />
            <Route
              path="/admin-profile/faculty/:id/course/:courseId"
              element={<AdminCourse />}
            />
            <Route
              path="/admin-profile/teacher/:id/"
              element={<TeacherProfileAdmin />}
            />

            {/*Rutas Alumno*/}
            <Route path="/student-profile" element={<StudentProfile />} />
            <Route
              path="/student-profile/course-view/:courseId"
              element={<CourseDetail />}
            />
            <Route
              path="/student-profile/course-view/:courseId/question/:questionId"
              element={<QuestionDetail />}
            />

            {/*Rutas Profesor*/}
            <Route path="/teacher-profile" element={<TeacherProfile />} />
            <Route
              path="/teacher-profile/create-course"
              element={<CreateCourse />}
            />
            <Route
              path="/teacher-profile/course-view/:courseId"
              element={<TeacherCourseView />}
            />
            <Route
              path="/teacher-profile/course-view/:courseId/create-question"
              element={<CreateQuestion />}
            />
            <Route
              path="/teacher-profile/course-view/:courseId/question/:questionId"
              element={<QuestionView />}
            />
              <Route
              path="/teacher-profile/course-view/:courseId/question/:questionId/answers"
              element={<AnswersView />}
            />
            <Route
              path="/teacher-profile/course-view/:courseId/question/:questionId/create-guideline"
              element={<CreateGuideline />}
            />
            <Route path="/payments/purchase" element={<Purchase />} />
            <Route path="/payments/checkout/:orderId" element={<Checkout />} />
            <Route path="/payments/history" element={<PaymentsHistoryPage />} />
            <Route path="/howitworks" element={<Howitworks />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </>
  );
}
