import './App.css';
import { v4 as uuidv4 } from 'uuid';
import ModifyItems from './components/ModifyItems';
import AddItem from './components/AddItem';
import { useReducer,useState, useEffect } from "react"
import Cart from './components/Cart';
import SortCategory from './components/SortCategory'
import styles from "./App.module.css"
import { Link } from 'react-router-dom';
import { Routes, Route } from "react-router";
import Menu from './components/Menu';
import ItemDetails from './components/ItemDetails';
import axios from "axios";




function App() {
  const initialState = {
    forSaleItems: [
     
    ],
    cartItems: [],
    categorySelected: "",
    toggle: true

  }

  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_ITEM":
        axios.post("http://localhost:8080/forSaleItems", action.payload).then((response)=>{
          // console.log(response)
        })
        return { ...state, forSaleItems: [...state.forSaleItems, action.payload] }
      case "EDIT_ITEM":
        axios.put(`http://localhost:8080/forSaleItems/${action.payload.id}`, action.payload)
        .then((response)=>{
          console.log(response);
        })
        console.log(action.payload)
        return {
          ...state, forSaleItems: state.forSaleItems.map(item => {
            if (item.id === action.payload.id) {
              item.name = action.payload.name;
              item.price = action.payload.price;
              item.category = action.payload.category
              item.image=action.payload.image
              item.desc=action.payload.desc
            }
            return item
          }),
          cartItems: state.cartItems.map(item => {
            if (item.id === action.payload.id) {
              item.name = action.payload.name;
              item.price = action.payload.price;
              item.category = action.payload.category
              item.image=action.payload.image
              item.desc=action.payload.desc
            }
            return item
          })
        };
      case "DELETE_ITEM":
       
        axios.delete(`http://localhost:8080/forSaleItems/${action.payload.id}`).then((response)=>{
          console.log(response)
        });
        return {
          ...state,
          forSaleItems: state.forSaleItems.filter(item => item.id !== action.payload.id),
          cartItems: state.cartItems.filter(item => item.id !== action.payload.id)
        };
      case "ADD_TO_CART":
        return {
          ...state, cartItems: action.payload
        }

      case "DELETE_CART_ITEM":
        return {
          ...state, cartItems: state.cartItems.filter(item => item.id !== action.payload.id)
        }
      case "DECREMENT":
        return {
          ...state, cartItems: state.cartItems.map(
            item => {
              if (item.id === action.payload.id) {
                item.quantity = item.quantity - 1
              }
              return item
            }
          )
        }
      case "INCREMENT":
        return {
          ...state, cartItems: state.cartItems.map(
            item => {
              if (item.id === action.payload.id) {
                item.quantity = item.quantity + 1
              }
              return item
            }
          )
        }
      case "CATEGORY_SELECTION":
        return {
          ...state, categorySelected: action.payload.categorySelected
        }
      case "TOGGLE":
        return {
          ...state, toggle: action.payload.toggle
        }
      case "LOAD_FROM_JSON" :
        return {
          ...state, forSaleItems: action.payload
        };

      default: {
        return (alert("there is something wong"))
      }
    }
  }

  const handleAddToCartClick = (id, counter) => {
    const cartCopy = [...state.cartItems]

    let exists = false;

    cartCopy.forEach((item) => {
      if (id === item.id) {
        item.quantity = item.quantity + counter
        exists = true;
      }
    });

    if (exists === false) {
      let newItem = state.forSaleItems.filter(item => item.id === id)

      newItem = Object.assign({}, ...newItem)

      const item = {
        ...newItem, quantity: counter
      };

      cartCopy.push(item);
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: cartCopy
    })
    alert("added to cart successfully!")
  }

  //initial load
  useEffect(() => {
    axios.get("http://localhost:8080/forSaleItems").then((response) => {
      dispatch({
        type: "LOAD_FROM_JSON",
        payload: response.data
      })
    });
  }, []);
 
  const [state, dispatch] = useReducer(reducer, initialState);

  const categories = state.forSaleItems.reduce((categories, item) => {
    if (!categories.includes(item.category)) {
      categories.push(item.category);
    }
    return categories
  }, [])

  let cartTotal = 0;
  const calculateTotal = () => {
    state.cartItems.forEach(item => { cartTotal += item.quantity * item.price })
    return cartTotal
  }
  calculateTotal()

  let filteredItems = state.categorySelected === "" || undefined ?
    state.forSaleItems :
    state.forSaleItems.filter(item => item.category === state.categorySelected);

  const displayModify = filteredItems.map(item => <ModifyItems key={item.id} item={item} dispatch={dispatch} handleAddToCartClick={handleAddToCartClick} />)
  const displayMenu = filteredItems.map(item => <Menu key={item.id} item={item} handleAddToCartClick={handleAddToCartClick} dispatch={dispatch} />)
  const displayCart = state.cartItems.map(item => <Cart item={item} key={item.id} dispatch={dispatch} cartTotal={cartTotal} />)

  const [toggle,setToggle] = useState(false)

  return (
    <div className={styles.App}>
      <div className={styles.container}>
        <div className={styles.header}> 
          {/* <img src={banner} alt="banner" className={styles.img}/> */}
          <strong>Resto App</strong>
        </div>
        <nav>
          <Link to="/" className={styles.tab1}>Menu</Link>
          <Link to="/cart" className={styles.tab2}>Cart</Link>
          <Link to="/modifyitems" className={styles.tab3}>Modify Items</Link>
        </nav>
        <div className={styles.main}>
          <Routes>
            (<Route path="/" element={state.forSaleItems.length === 0
              ? <div className={styles.menu}>"no item for sale"</div>
              :
              <>
                <div className={styles.category}>
                  <SortCategory categories={categories} dispatch={dispatch} />
                </div>
                <div className={styles.menu}>
                  {displayMenu}
                </div>
              </>

            }
            />)

            <Route path="/item/:id" element={<ItemDetails forSaleItems={state.forSaleItems} cartItems={state.cartItems} handleAddToCartClick={handleAddToCartClick} />} />

            <Route path="cart" element={state.cartItems.length === 0
              ? <div className={styles.cart}><strong>no items add to cart now</strong></div>
              :
              <>
                <div className={styles.cart}>
                  {displayCart}
                  <div className={styles.grandTotal}>
                    <b>Total :  </b>₱  {cartTotal}
                  </div>
                </div>

              </>}
            />

            <Route path="/modifyitems" element={
              
              <div className={styles.modifyItems}>
                {toggle? <AddItem dispatch={dispatch} forSaleItems={state.forSaleItems} setToggle={setToggle} /> : <button onClick={()=>setToggle(true)}>Add an Item</button>}
                <div className={styles.displayModify}>
                  {displayModify}
                </div>
              </div>
            }
            />
          </Routes>
        </div>


      </div>
    </div>
  );
}

export default App;
