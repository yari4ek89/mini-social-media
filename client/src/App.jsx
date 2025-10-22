// Import neccessary libraries
import "./App.css"; // import styles
import Header from "./components/FeedPage/Header/Header.jsx"; // import header
import MainContainer from "./components/FeedPage/MainContainer/MainContainer.jsx"; // import main container

// Feed object
function App() {
    return (
        <div className="app">
            <Header/>
            <MainContainer/>
        </div>
    );
}

// Export feed
export default App;
