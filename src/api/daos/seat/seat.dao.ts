import SeatDTO from '../../dtos/seat/seat.dto';
import { seatModel } from '../../models/seat/seat-schema';

export default class SeatDAO {
    public async create(dto: SeatDTO): Promise<SeatDTO> {
        const createModel = new seatModel(dto);
        return await createModel.save();
    }

    public async list(): Promise<SeatDTO[]> {
        console.log(seatModel.find().exec());
        return await seatModel.find();
    }

    public async getAvailableSeatlist(seats: number): Promise<SeatDTO[]> {
        return await seatModel.find({status: 'available'}).limit(seats).sort({index: 1}).exec();
    }

    public async update(id: any, dto: SeatDTO): Promise<SeatDTO> {
        const updateModel = await seatModel.findById(id).exec();
        Object.assign(updateModel, dto);
        return await updateModel.save();
    }

}
