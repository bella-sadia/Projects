import mongoose from 'mongoose';

const deliveryPartnerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'Busy'],
        default: 'Available',
    }
});

const DeliveryPartner = mongoose.model('DeliveryPartner', deliveryPartnerSchema, 'delivery_partners');

export default DeliveryPartner;
