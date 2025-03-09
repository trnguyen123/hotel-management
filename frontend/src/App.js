import "./App.css";
import Header from "./components/Header.js";
import { BookingProvider } from "./components/BookingContext.js";
import Rooms from "./components/Rooms.js";
import Footer from "./components/Footer.js";
// import Login from "./components/Login.js";
import Reports from "./components/Reports.js";
import Service from "./components/Service.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CalendarProvider } from "./components/CalendarContext.js";

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Header />
        <div className='content'>
          <Routes>
            <BookingProvider>
              <CalendarProvider>
                <Route path='/' element={<Rooms />} />
                <Route path='/reports' element={<Reports />} />
                <Route path='/service' element={<Service />} />
              </CalendarProvider>
            </BookingProvider>
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
