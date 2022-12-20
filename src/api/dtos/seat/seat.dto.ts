export default class SeatDTO {
    public _id: string;
    public name: string;
    public index: number;
    public status: string;
    public userDetails: {
      name: string;
      email: string;
    };
}
