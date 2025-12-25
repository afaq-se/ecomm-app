import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://img.favpng.com/8/19/8/united-states-avatar-organization-information-png-favpng-J9DvUE98TmbHSUqsmAgu3FpGw.jpg"
    },
    role: {
        type: String,
        enum: ["admin", "user", "deliveryman"],
        default: "user"
    },
    addresses: [
        {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            postalCode: {
                type: String,
                required: true
            },
            isDefault: {
                type: Boolean,
                default: false
            }
        }
    ],
    // wishlist
    // cart
    // orderss
}, {
    timestamp: true
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre("save", async function (next) {
    if (this.isModified("addresses")) {
        const defaultAddress = this.addresses.find((addr) => addr.isDefault);
        if (defaultAddress) {
            this.addresses.forEach((addr) => addr.isDefault = false);
        };
    }
    next();
});

const User = mongoose.model("user", userSchema);
export default User;
