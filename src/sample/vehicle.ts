import { injectable } from "inversify";

@injectable()
export class Vehicle
{
	name:string
	manufacturer:string

	constructor() {
		this.name = 'CRV'
		this.manufacturer = 'Honda'
	}
}