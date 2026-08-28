import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  FormControl,
  Grid,
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

function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [loading, setLoading] = useState(true);

  const pageSize = 12;

  useEffect(() => {
    getProducts();
  }, [search, categoryId, sort, page, minPrice, maxPrice]);

  useEffect(() => {
    getCategories();
  }, []);

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

  const getCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data);
    } catch (error) {
      console.error(error);
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
            {products.map((product) => (
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
                  onClick={() => navigate(`/products/${product.id}`)}
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "0.3s",
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
                  />

                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {product.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {product.categoryName}
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>
                      ${product.price.toFixed(2)}
                    </Typography>

                    <Typography
                      variant="body2"
                      color={product.stock > 0 ? "success.main" : "error.main"}
                      sx={{ mt: 1 }}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
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