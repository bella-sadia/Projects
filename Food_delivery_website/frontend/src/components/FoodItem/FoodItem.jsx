import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ _id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

    // Debugging logs
    console.log("Cart Items:", cartItems);
    console.log("Current Item ID:", _id);

    // Ensure _id is a string
    const itemId = typeof _id === 'object' ? _id["$oid"] : _id;
    const itemInCart = cartItems[itemId] || 0; // Safe default value

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={`${url}/images/${image}`} alt={name} />
                {itemInCart === 0 ? (
                    <img
                        className='add'
                        onClick={() => addToCart(itemId)}
                        src={assets.add_icon_white}
                        alt="Add"
                    />
                ) : (
                    <div className='food-item-counter'>
                        <img
                            onClick={() => removeFromCart(itemId)}
                            src={assets.remove_icon_red}
                            alt="Remove"
                        />
                        <p>{itemInCart}</p>
                        <img
                            onClick={() => addToCart(itemId)}
                            src={assets.add_icon_green}
                            alt="Add"
                        />
                    </div>
                )}
            </div>
            <div className='food-item-info'>
                <div className='food-item-name-rating'>
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating" />
                </div>
                <p className='food-item-desc'>{description}</p>
                <p className='food-item-price'>TK{price}</p>
            </div>
        </div>
    );
};

export default FoodItem;
