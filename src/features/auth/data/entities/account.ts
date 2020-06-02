export class Account {
    id: number;
    points: number;

    constructor(props: {
        id: number;
        points: number;
    }) {
        this.id = props.id;
        this.points = props.points;
    }
}