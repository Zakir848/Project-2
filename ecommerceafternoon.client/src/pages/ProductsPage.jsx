import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContextGlobal";
import { Favorite } from "@mui/icons-material";

function ProductsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isCheck, setIsCheck] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(true);

  const pageSize = 12;

  useEffect(() => {
    if (isCheck) {
      getOnlyDiscount();
    } else {
      getProducts();
    }
  }, [search, categoryId, sort, page, minPrice, maxPrice, isCheck]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (user) {
      getWishlist();
    }
  }, [user, isClicked]);

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

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products", {
        params: {
          search: search || undefined,
          categoryId: categoryId || undefined,
          sort,
          page,
          pageSize,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
        },
      }); 

      setProducts(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  var getWishlist = async () => {
    try {
      const response = await api.get("/user/wishlist");
      setWishlist(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsClicked(false);
    }
  };

  const getOnlyDiscount = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/discounted");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addWishList = async (id) => {
    try {
      if (user == null) {
        console.log("User Is Null");
        return;
      }

      const response = await api.post(`/user/add-wishlist?productId=${id}`);
      return response.data;
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h3" fontWeight="bold" sx={{ mb: 4 }}>
        Products
      </Typography>

      <Grid container spacing={2} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <TextField
            fullWidth
            label="Search products"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>

            <Select
              value={categoryId}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>

              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="Min Price"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="Max Price"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Sort</InputLabel>

            <Select value={sort} label="Sort" onChange={handleSortChange}>
              <MenuItem value="newest">Newest</MenuItem>

              <MenuItem value="priceasc">Price: Low to High</MenuItem>

              <MenuItem value="pricedesc">Price: High to Low</MenuItem>

              <MenuItem value="nameasc">Name: A-Z</MenuItem>

              <MenuItem value="namedesc">Name: Z-A</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid sx={{ placeContent: "center" }}>
          <FormControlLabel
            control={<Checkbox />}
            label="Only Discount"
            onClick={() => {
              getOnlyDiscount();
              setIsCheck(!isCheck);
            }}
          />
        </Grid>
      </Grid>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
              }}
            >
              <Skeleton variant="rectangular" height={250} />

              <Skeleton height={40} />

              <Skeleton width="60%" />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
          }}
        >
          <Typography variant="h5">No products found</Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try changing your search or filters.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {products.map((product) => {
              const isWished = wishlist.some(
                (item) => item.productId == product.id,
              );
              return (
                <Grid
                  key={product.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                    lg: 3,
                  }}
                >
                  <Card
                    onClick={() => {
                      navigate(`/products/${product.id}`);
                      incrimentViewCountProduct(product.id);
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
                      image={product.imageUrl}
                      alt={product.name}
                      style={{ objectFit: "fill" }}
                    />

                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {product.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {product.categoryName}
                      </Typography>

                      {product.discountPrecent == 0 ? (
                        <>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ mt: 2 }}
                          >
                            ${product.price.toFixed(2)}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mt: 2 }}
                        >
                          <Typography
                            fontWeight="bold"
                            sx={{
                              mt: 2,
                              textDecoration: "line-through",
                              color: "#888",
                              fontSize: "80%",
                            }}
                          >
                            ${product.price.toFixed(2)}
                          </Typography>

                          <p>${product.discountPrice.toFixed(2)}</p>
                        </Typography>
                      )}

                      <Typography
                        variant="body2"
                        color={
                          product.stock > 0 ? "success.main" : "error.main"
                        }
                        sx={{ mt: 1 }}
                      >
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </Typography>
                    </CardContent>

                    {product.discountPrecent > 0 && (
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
                        {product.discountPrecent}% OFF
                      </Typography>
                    )}

                    {user && (
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
                          setIsClicked(true);
                          addWishList(product.id);
                        }}
                      >
                        {isWished ? (
                          <Favorite color="error" />
                        ) : (
                          <Favorite color="action" />
                        )}
                      </IconButton>
                    )}
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="large"
            />
          </Box>
        </>
      )}
    </Container>
  );
}

export default ProductsPage;
