// Import neccessary libraries
import "./App.css"; // import styles
import Header from "./components/FeedPage/Header/Header"; // import header
import MainContainer from "./components/FeedPage/MainContainer/MainContainer"; // import main container

// Feed object
function App() {
  return (
    <div className="app">
      <Header />
      <MainContainer />
    </div>
  );
}

// Export feed
export default App;
