export class Player {
  id: string;
  x: number;
  y: number;
  direction: string;

  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.direction = "none";
  }
}
