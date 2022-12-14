import './App.css';
import { Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import Header from './include/Header';
import Error from './components/Error';
import Content from './components/Content';
import Footer from './include/Footer';

function App() {
  return (
    <>
        <body class="d-flex flex-column hv-100" style={{ minHeight: "100vh" }}>
            <main class="flex-shrink-0" style={{ flex: "1 0 auto" }}>
                <Header />
                <Routes>
                    <Route path='*' element={<Error />} status={404} />
                    <Route path='/' element={<Index />} />
                    <Route path='/verse/:book/:chapter' element={<Content />} />
                    <Route path='/verse/:book/:chapter/:verse' element={<Content />} />
                </Routes>
            </main>
            <Footer />
        </body>
    </>
);
}

export default App;
