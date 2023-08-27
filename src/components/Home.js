import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../userContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Dropdown, FormControl } from 'react-bootstrap';
import { FaShoppingCart, FaBell, FaSignOutAlt } from 'react-icons/fa';
import Card from 'react-bootstrap/Card';
import './Home.css';


function Home({ cartItems, addToCart }) {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { username } = useContext(UserContext); 
    const [cartCount, setCartCount] = useState(0); // State for cart count
    
    const handleLogout = () => {
  
      // Redirect to the "/login" page
      navigate('/');
    };
  
    useEffect(() => {
      const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalCount);
      fetch('http://localhost:8000/product/get')
        .then(res => res.json())
        .then(json => setProducts(json));
    }, [cartItems]);
  
    const truncateDescription = (description, maxLength) => {
      if (description.length > maxLength) {
        const truncated = description.slice(0, maxLength);
        const lastSpaceIndex = truncated.lastIndexOf(' ');
        return truncated.slice(0, lastSpaceIndex) + '...';
      }
      return description;
    };
    const [searchQuery, setSearchQuery] = useState('');

    // State for sort by option
    const [sortBy, setSortBy] = useState('');

    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
      const updatedFilteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(updatedFilteredProducts);
    }, [searchQuery, products]);

    const handleOrderNow = (product) => {
      const { title, price, description, image } = product;
      setCartCount((prevCount) => prevCount + 1);
      addToCart({ title, price, description, image }); // Add the properties with the expected names to the cart
    };
  
    const sortedProducts =
    sortBy === 'asc'
      ? filteredProducts.sort((a, b) => a.price - b.price)
      : sortBy === 'desc'
      ? filteredProducts.sort((a, b) => b.price - a.price)
      : filteredProducts;

    return (
      <div>
        <nav className="navbar navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand">Welcome, {username || 'Guest'}</a>
            <div className="d-flex">
            <Link to="/cart" className="navbar-icon" style={{ position: 'relative' }}>
            <FaShoppingCart className="navbar-icon-item" style={{ marginLeft: '-2rem', marginTop: '0.6rem' }} />
            {cartCount > 0 && (
              <span style={{ marginLeft: '-0.3rem' }} className="badge badge-warning" id="lblCartCount">
                {cartCount}
              </span>
            )}
            </Link>
            <div className="d-flex">
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic" style={{ cursor: 'pointer', color: 'blue' }}>
                  {username || 'Guest'} 
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">Orders</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            </div>
          </div>
        </nav>

        <Container fluid style={{ marginTop: '1rem' }}>
        <Row>
          <Col xs={12} sm={8} md={6}>
            <FormControl style={{ marginLeft: '21rem' }}
              type="text"
              placeholder="Search by product title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col xs={6} md={2}>
            <Dropdown style={{ marginLeft: '21rem' }}>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Sort by: {sortBy === 'asc' ? 'Low to High' : sortBy === 'desc' ? 'High to Low' : 'Select'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSortBy('asc')}>Low to High</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy('desc')}>High to Low</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
  
        <Container fluid>
          <Row className="g-1">
            {sortedProducts.map(product => (
              <Col key={product.id}>
                <div className="card" style={{ width: '18rem', height: '100%', margin: '1rem 0.5rem' }}>
                  <img className="card-img-top" src={`/uploads/${product.image}`} alt={product.title} style={{ height: '200px' }} />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text" style={{ fontSize: '18px', fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
                    <p className="card-text flex-grow-1">{truncateDescription(product.description, 100)}</p>
                    {product.quantity > 0 ? (
                    <button onClick={() => handleOrderNow(product)} className="btn btn-primary">
                      Add to Cart
                    </button>
                  ) : (
                    <div className="btn btn-danger disabled">Out of Stock</div>
                  )}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
      </Container>
      </div>
    );
  }

  const mapStateToProps = (state) => {
    return {
      cartItems: state.cart.cartItems || [],
    };
  };

  // Map dispatch actions to component props
  const mapDispatchToProps = (dispatch) => {
    return {
      addToCart: (product) => dispatch({ type: 'ADD_TO_CART', payload: product }),
    };
  };
   


  export default connect(mapStateToProps, mapDispatchToProps)(Home);