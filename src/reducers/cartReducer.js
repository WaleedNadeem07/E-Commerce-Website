const initialState = {
    cartItems: [],
  };
  
  const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_TO_CART':
      // Check if the product already exists in the cart
      const existingProduct = state.cartItems.find((item) => item.title === action.payload.title);

      if (existingProduct) {
        // If the product exists, increase the quantity
        const updatedCartItems = state.cartItems.map((item) =>
          item.title === action.payload.title ? { ...item, quantity: item.quantity + 1 } : item
        );

        return {
          ...state,
          cartItems: updatedCartItems,
        };
      } else {
        // If the product is new, add it to the cart with a quantity of 1
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
        };
      }
      case 'REMOVE_FROM_CART':
      const updatedCartItems = state.cartItems.filter(item => item.title !== action.payload);
      return {
        ...state,
        cartItems: updatedCartItems,
      };
      case 'INCREMENT_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.title === action.payload ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
      case 'DECREMENT_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.title === action.payload && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ),
      };
      // Add other cases for different actions if needed
  
      default:
        return state;
    }
  };
  
  export default cartReducer;