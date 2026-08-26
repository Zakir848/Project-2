import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
// import ProductDetailsPage from "./pages/ProductDetailsPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                {/* <Route
                    path="/products/:id"
                    element={<ProductDetailsPage />}
                /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;