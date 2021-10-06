import { createUserValidator, findUserValidator, updateUserValidator, deleteUserValidator } from "../validators";
import { User } from "../models";
import { Service } from "../classes";

export class UserService extends Service {
  constructor() {
    const validators = {
      create: createUserValidator,
      find: findUserValidator,
      findOne: findUserValidator,
      deleteOne: deleteUserValidator,
      updateOne: updateUserValidator,
    };
    super(validators, User);
  }
}
