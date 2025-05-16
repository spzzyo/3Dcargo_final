export interface IMyCargo {
    _id?: string;      
    _rev?: string;
    quantity: number;
    length: number;
    breadth: number;
    height: number;
    weight: number;
    type?: string;
  }