import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext.jsx';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
    const { food_list } = useContext(StoreContext);

    // Ensure food_list is an array and category is valid
    if (!Array.isArray(food_list)) {
        return <div>Error: Food list is not available.</div>;
    }

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            <div className="food-display-list">
                {food_list.length > 0 ? (
                    food_list.map((item) => (
                        (category === "All" || item.category === category) && (
                            <FoodItem
                                key={item._id}
                                _id={item._id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        )
                    ))
                ) : (
                    <p>No food items available for this category.</p>
                )}
            </div>
        </div>
    );
};

export default FoodDisplay;
