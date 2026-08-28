import {
    AppBar,
    Badge,
    Box,
    Button,
    Container,
    IconButton,
    Toolbar,
    Typography,
  } from "@mui/material";
  
  import { getCart } from "../../services/cartService";
  import { useEffect, useState } from "react";
  
  import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
  import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
  import PersonOutlineIcon from "@mui/icons-material/Person2Outlined";
  import { useNavigate } from "react-router-dom";
  
  function Navbar() {
    const navigate = useNavigate();
  
    const userId = 1;
  
    const [cartCount, setCartCount] = useState(0);
  
    useEffect(() => {
      const loadCart = async () => {
        try {
          const cart = await getCart(userId);
  
          const count = cart.items.reduce(
            (total, item) => total + item.quantity,
            0
          );
  
          setCartCount(count);
        } catch (error) {
          console.error(error);
        }
      };
  
      loadCart();
    }, []);
  
    return (
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ minHeight: 72 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                cursor: "pointer",
                mr: 5,
              }}
              onClick={() => navigate("/")}
            >
              ShopX
            </Typography>
  
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                gap: 1,
              }}
            >
              <Button color="inherit" onClick={() => navigate("/")}>
                Home
              </Button>
  
              <Button color="inherit" onClick={() => navigate("/products")}>
                Products
              </Button>
            </Box>
  
            <Box sx={{ flexGrow: 1 }} />
  
            <IconButton>
              <Badge badgeContent={0} color="error">
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>
  
            <IconButton onClick={() => navigate("/cart")}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
  
            <IconButton>
              <PersonOutlineIcon />
            </IconButton>
  
            <Button
              variant="contained"
              sx={{
                ml: 2,
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    );
  }
  
  export default Navbar;