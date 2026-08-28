import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import Footer from "./components/layouts/Footer";
import Navbar from "./components/layouts/Navbar";
import CartPage from "./pages/CartPage";

function App() {
    return (
        <BrowserRouter>
        <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route
                    path="/products/:id"
                    element={<ProductDetailsPage />}
                />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;