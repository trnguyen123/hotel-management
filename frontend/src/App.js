import "./App.css";
import Header from "./components/Header.js";
import { BookingProvider } from "./components/BookingContext.js";
import Family from "./components/Family";
import Queen from "./components/Queen";
import Standard from "./components/Standard";
import Footer from "./components/Footer.js";
import Login from "./components/Login.js";
import Reports from "./components/Reports.js";
import Service from "./components/Service.js";
import { CalendarProvider } from "./components/CalendarContext.js";

function App() {
  return (
    <div className='App'>
      <Header></Header>
      <BookingProvider>
        <CalendarProvider>
          <Family />
          <Queen />
          <Standard />
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
