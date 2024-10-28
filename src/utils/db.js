import mongoose from "mongoose";

const connect = async () => {
    try {
        mongoose.connect(process.env.MONGO)
    } catch {
        throw new Error("Connection Failed")
    }
}

export default connect;