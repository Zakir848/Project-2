import React, { useEffect, useState } from "react";
import ProductsPage from "./ProductsPage";
import api from "../services/api";
import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Favorite } from "@mui/icons-material";

export default function WishList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    var wishlist = async (id) => {
      try {
        setLoading(true);
        const response = await api.get("/user/wishlist");
        console.log(response.data);

        setProducts(response.data);
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };

    wishlist();
  }, []);

  const incrimentViewCountProduct = async (id) => {
    try {
      setLoading(true);

      const response = await api.patch(`/products/${id}/incriment-view`);

      return response.data;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addWishList = async (id) => {
    try {
      const response = await api.post(`/user/add-wishlist?productId=${id}`, {});

       setProducts((prevProducts) => prevProducts.filter(p => p.productId !== id));
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  if (!loading && (!products || products.length === 0)) {
    return (
      <Container sx={{ py: 5, textAlign: "center" }}>
        <Typography variant="h6">You do not have any wishlisted products.</Typography>
      </Container>
    );
  }
  return (
    <Grid container spacing={3} sx={{ py: 5, px: 3 }}>
      {loading ? (
        <Container sx={{ py: 5 }}>
          <Typography>Loading...</Typography>
        </Container>
      ) : (
        products.map((product) => (
          <Grid
            key={product.productId}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3,
            }}
          >
            <Card
              onClick={(e) => {
                incrimentViewCountProduct(product.productId);
                navigate(`/products/${product.productId}`);
              }}
              sx={{
                height: "100%",
                cursor: "pointer",
                borderRadius: 3,
                overflow: "hidden",
                transition: "0.3s",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={product.productImageUrl}
                alt={product.productName}
                style={{ objectFit: "fill" }}
              />

              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {product.productName}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {product.productCategoryName}
                </Typography>

                {product.productDiscountPrecent == 0 ? (
                  <>
                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                      ${product.productPrice.toFixed(2)}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        mt: 2,
                        textDecoration: "line-through",
                        color: "#888",
                        fontSize: "80%",
                      }}
                    >
                      ${product.productPrice.toFixed(2)}
                    </Typography>

                    <p>${product.productDiscountPrice.toFixed(2)}</p>
                  </Typography>
                )}

                <Typography
                  variant="body2"
                  color={product.stock > 0 ? "success.main" : "error.main"}
                  sx={{ mt: 1 }}
                >
                  {product.productStock > 0
                    ? `${product.productStock} in stock`
                    : "Out of stock"}
                </Typography>
              </CardContent>
              {product.productDiscountPrecent > 0 && (
                <Typography
                  sx={{
                    position: "absolute",
                    zIndex: "5",
                    top: "5%",
                    transform: "rotate(-30deg)",
                    background: "red",
                    color: "white",
                    pl: 1,
                    pr: 1,
                    borderRadius: "50px",
                  }}
                >
                  {product.productDiscountPrecent}% OFF
                </Typography>
              )}

              <IconButton
                sx={{
                  position: "absolute",
                  zIndex: "100",
                  left: "80%",
                  top: "2%",
                  borderRadius: "50px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  addWishList(product.productId);
                }}
              >
                <Favorite color="error" />
              </IconButton>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
}
