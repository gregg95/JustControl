import { User } from "./models/user.model";
import { Injectable } from '@angular/core';

@Injectable()
export class Globals {
    user : User;
}