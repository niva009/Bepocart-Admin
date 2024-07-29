import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get("http://51.20.129.52/admin/Bepocart-Blogs/", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        setError("Invalid data format received");
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        navigate('/login');
      } else {
        setError("Error fetching banners");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <BlogCard products={products} />;
};

const BlogCard = ({ products }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getPreviewContent = (content) => {
    const words = content.split(" ");
    return words.length > 50 ? words.slice(0, 50).join(" ") + "..." : content;
  };

  return (
    <Grid container spacing={2}>
      {products.map((product, index) => (
        <Grid
          key={index}
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              width: "100%",
              height: "400px", // Fixed height for uniform card size
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img src={product.image} alt="img" width="100%" style={{ height: '200px', objectFit: 'cover' }} />
            <CardContent
              sx={{
                paddingLeft: "30px",
                paddingRight: "30px",
                flexGrow: 1,
                overflow: "auto", // Make content scrollable if it exceeds the card height
              }}
            >
              <Typography
                sx={{
                  fontSize: "h4.fontSize",
                  fontWeight: "500",
                }}
              >
                {product.title}
              </Typography>
              <Typography
                color="textSecondary"
                sx={{
                  fontSize: "14px",
                  fontWeight: "400",
                  mt: 1,
                }}
              >
                {expanded[index] ? product.content : getPreviewContent(product.content)}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: "15px",
                }}
                color="primary"
                onClick={() => toggleExpand(index)}
              >
                {expanded[index] ? "Show Less" : "Learn More"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Blogs;
