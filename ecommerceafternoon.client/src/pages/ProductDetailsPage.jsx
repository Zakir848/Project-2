import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Rating,
  TextField,
  Typography,
} from "@mui/material";

import { addToCart } from "../services/cartService";

import api from "../services/api";
import { useAuth } from "../context/AuthContextGlobal";
import {
  Delete,
  Label,
  Send,
  Star,
  StarBorder,
  StarHalfRounded,
} from "@mui/icons-material";

function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [commits, setCommits] = useState([]);

  const [isSubmit, setIsSubmit] = useState(false);

  const [error, setError] = useState("");

  const [rating, setRating] = useState();

  const [text, setText] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getProduct();
  }, [id]);

  useEffect(() => {
    const getProductReview = async () => {
      try {
        const response = await api.get(`/products/${id}/reviews`);
        setCommits(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getProductReview();
  }, [isSubmit]);

  const handleAddToCart = async () => {
    try {
      await addToCart(user.userId, product.id, quantity);
    } catch (error) {
      console.error(error);
    }
  };

  const sendCommit = async () => {
    try {
      setIsSubmit(true);

      if (!user) {
        navigate("/login");
        return;
      }

      const review = {
        userId: user.userId,
        rating: rating,
        commit: text,
      };

      const response = await api.post(`/Products/${id}/add-reviews`, review);

      return response.data;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmit(false);
      setText("");
      setRating(0);
    }
  };

  if (!product) {
    return (
      <Container sx={{ py: 5 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6, color: "black" }}>
      <Grid
        container
        spacing={6}
        sx={{
          position: "relative",
        }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{
              width: "100%",
              borderRadius: 3,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ placeItems: "center" }}>
          <Typography variant="h5" fontWeight="bold">
            View: {product.viewCount}
          </Typography>

          <Typography variant="h3" fontWeight="bold">
            {product.name}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 2 }}>
            {product.category?.name}
          </Typography>

          {product.discountPrecent > 0 ? (
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mt: 3, placeItems: "center" }}
            >
              <Typography
                fontWeight="bold"
                sx={{
                  mt: 3,
                  textDecoration: "line-through",
                  fontSize: "50%",
                  color: "#888",
                }}
              >
                ${product.price}
              </Typography>
              ${product.discountPrice.toFixed(2)}
            </Typography>
          ) : (
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 3 }}>
              ${product.price}
            </Typography>
          )}

          <Typography sx={{ mt: 3 }}>{product.description}</Typography>

          <Typography sx={{ mt: 3 }}>Stock: {product.stock}</Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </Button>

            <Typography>{quantity}</Typography>

            <Button
              variant="outlined"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            >
              +
            </Button>
          </Box>

          <Button
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
            disabled={product.stock === 0 || !user}
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>
          {!user && (
            <Typography sx={{ mt: 1, color: "darkorange" }}>
              For add need Sign In
            </Typography>
          )}
        </Grid>
        {product.discountPrecent > 0 && (
          <Typography
            sx={{
              position: "absolute",
              zIndex: "5",
              top: "4%",
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
      </Grid>

      <Divider sx={{ mt: 4 }} />

      <Grid container spacing={4} sx={{ mt: 6 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={1}
            sx={{ p: 4, borderRadius: 3, border: "1px solid #eaeaea" }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              Məhsulu Qiymətləndir
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Fikirləriniz bizim və digər alıcılar üçün önəmlidir.
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Typography fontWeight="medium">Sizin Balınız:</Typography>
              <Rating
                name="product-rating"
                onChange={(e) => {
                  setRating(e.target.value);
                }}
                precision={0.5}
                size="large"
              />
            </Box>

            <TextField
              fullWidth
              label="Rəyinizi bura yazın..."
              multiline
              rows={4}
              variant="outlined"
              placeholder="Məhsul haqqında nə düşünürsünüz?"
              onChange={(e) => setText(e.target.value)}
            />

            {error && <Typography sx={{ color: "red" }}> {error} </Typography>}

            <Button
              variant="contained"
              endIcon={<Send />}
              size="large"
              fullWidth
              sx={{
                backgroundColor: "black",
                "&:hover": { backgroundColor: "#333" },
                borderRadius: 2,
                py: 1.5,
                mt: 3,
              }}
              onClick={() => {
                if (rating == 0 || text == "" || text == " ") {
                  setError("Please, choice rating and writing text");
                  return;
                }

                setError("");
                sendCommit();
              }}
            >
              Rəyi Göndər
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Müştəri Rəyləri ({commits.length || 0})
          </Typography>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid #eaeaea",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
              {/* Nümunə Rəy 1 */}
              <ListItem
                alignItems="flex-start"
                sx={{ p: 3, display: "flex", placeContent: "space-between" }}
              >
                <Typography>COMMITS</Typography>
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  <Star sx={{ color: "orange" }} />{" "}
                  {`(${product.ratingAvg.toFixed(1)})`}
                </Typography>
              </ListItem>
              <Divider />

              {commits?.length == 0 ? (
                <Typography
                  style={{
                    height: "150px",
                    placeContent: "center",
                    fontSize: "25px",
                  }}
                >
                  No Commits
                </Typography>
              ) : (
                commits.map((commit, index) => (
                  <ListItem alignItems="flex-start" sx={{ p: 3 }} key={index}>
                    <Typography></Typography>
                    <ListItemAvatar>
                      <Avatar alt="User Name" sx={{ bgcolor: "#555" }}>
                        {commit.userFirstName[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography fontWeight="bold" variant="subtitle1">
                            {commit.userFirstName} {commit.userLastName}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Rating
                            value={commit.rating}
                            precision={0.5}
                            size="small"
                            readOnly
                            sx={{ mb: 1, display: "flex" }}
                          />
                          <Typography variant="body2" color="text.primary">
                            {commit.commit}
                          </Typography>
                        </>
                      }
                    />
                    <Divider />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetailsPage;
