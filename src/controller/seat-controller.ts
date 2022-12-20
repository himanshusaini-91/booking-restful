import express from "express";
import catchError from "../error/catch-error";
import IController from "../common/controller-interface";
import { MongoDBConnection } from "../api/mongodb-connection";
import IAuthenticatedRequest from "../guards/authenticated.request";
import authenticationGuard from "../guards/authentication.guard";
import SeatDAO from "../api/daos/seat/seat.dao";
import HandledApplicationError from '../error/handled-application-error';
import SeatDTO from "../api/dtos/seat/seat.dto";

export class SeatsController implements IController {
    public path = "/seats";
    public router = express.Router();
    private mongoDbConnection: MongoDBConnection;
    private seatDAO: SeatDAO;

    constructor(mongoDbConnection: MongoDBConnection) {
        this.mongoDbConnection = mongoDbConnection;
        this.seatDAO = new SeatDAO();
        this.initializeRoutes();

    }

    private initializeRoutes() {
        this.router.post(`${this.path}/booked`, authenticationGuard, this.setBooked);
        this.router.get(`${this.path}/list`, authenticationGuard, this.getSeatList);
    }

    // function: Seatbooked
    // purpose: This function is used to find available seats and change status to booked  and update into the database.

    private readonly setBooked = async (req: IAuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
        try {
            if(req.body.requestedSeats > 7) {
                throw new HandledApplicationError(500, 'User cannot select more than 7 seats at a time');
            } else {
                const dto  = this.toSeatDTO(req.body);
                const list:SeatDTO[]  = await this.seatDAO.getAvailableSeatlist(req.body.requestedSeats)
                if(list.length > 0 ) {
                    for(let i=0; i<=list.length-1; i++) {
                        list[i].status = 'booked';
                        list[i].userDetails = dto.userDetails;
                        await this.seatDAO.update(list[i]._id, list[i])
                    }
                    const message = list.length >= req.body.requestedSeats ? 'all requested seats are booked' :  'partially seats are booked'
                    res.json(message);
                }
                else {
                    throw new HandledApplicationError(500, 'All seats are booked');
                }
            }
        } catch (err) {
            catchError(err, next);
        }
    }

    // function: getSeatList
    // purpose: This function is used for getting the seatList from the database.
    private readonly getSeatList = async (req: IAuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
        try {
            const list = await this.seatDAO.list();
            res.json(list);
        } catch (err) {
            catchError(err, next);
        }
    }

    toSeatDTO(data: any) {
        const seatDTO = new SeatDTO();
        seatDTO.name = data.name ? data.name: ''
        seatDTO.index = data.index ? data.index: ''
        seatDTO.status = data.status ? data.status: ''
        seatDTO.userDetails = data.userDetails ? data.userDetails: ''
        return seatDTO
    }

}
