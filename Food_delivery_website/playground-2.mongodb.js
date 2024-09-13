// Switch to the 'food-del' database
const database = 'food-del'; // Use your database name
const collection = 'delivery_partners'; // Name of the collection
use(database);

// Insert delivery partners into the collection (this will create the collection automatically)
db[collection].insertMany([
    { name: "John Doe", phone_number: "01716666677", status: "Available" },
    { name: "Jane Smith", phone_number: "01987878721", status: "Available" },
    { name: "Sam Brown", phone_number: "01885232421", status: "Busy" }
]);
