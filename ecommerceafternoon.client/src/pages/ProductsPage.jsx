import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Typography
} from "@mui/material";

import api from "../services/api";

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await api.get("/products");

                setProducts(response.data.items);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    if (loading) {
        return (
            <Container sx={{ py: 5 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ mb: 4 }}
            >
                Products
            </Typography>

            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid
                        key={product.id}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                            lg: 3
                        }}
                    >
                        <Card
                            sx={{
                                height: "100%",
                                transition: "0.3s",
                                "&:hover": {
                                    transform: "translateY(-5px)"
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="220"
                                image={product.imageUrl}
                                alt={product.name}
                            />

                            <CardContent>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    {product.name}
                                </Typography>

                                <Typography
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    {product.categoryName}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    sx={{ mt: 2 }}
                                >
                                    ${product.price}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default ProductsPage;