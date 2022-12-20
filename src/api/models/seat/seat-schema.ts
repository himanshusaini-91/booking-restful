import mongoose, { Schema } from 'mongoose';
import SeatDTO from '../../dtos/seat/seat.dto';

const seatSchema = new mongoose.Schema({
    name: {
      required: false,
      type: String,
    },
    index: {
      required: false,
      type: Number,
    },
    status: {
      required: false,
      type: String,
    },
    userDetails: {
        name: {
            required: false,
            type: String,
          },
        email: {
            required: false,
            type: String,
        }
    },
});

export const seatModel = mongoose.model<
SeatDTO & mongoose.Document
>('seats', seatSchema);
// export const seatModel = mongoose.model<SeatDTO & mongoose.Document>(
//   'seats',
//   SeatSchema,
//   'seats',
// );
