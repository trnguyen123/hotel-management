import "./App.css";
import Header from "./components/Header.js";
import { BookingProvider } from "./components/BookingContext.js";
import Rooms from "./components/Rooms.js"; 
import Footer from "./components/Footer.js";
import Login from "./components/Login.js";
import Reports from "./components/Reports.js";
import Service from "./components/Service.js";
import { CalendarProvider } from "./components/CalendarContext.js";

function App() {
  return (
    <div className="App">
      <Header />
      <BookingProvider>
        <CalendarProvider>
          <Rooms /> 
          <Footer />
          <Login />
          <Service />
          <Reports />
        </CalendarProvider>
      </BookingProvider>
    </div>
  );
}

export default App;
