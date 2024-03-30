import Item from "#models/item";
import User from "#models/user";

export interface Product {
    info: Item;
    owner: User;
}