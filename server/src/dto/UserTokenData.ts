import {UserDto} from "./UserDto";

export type UserTokenData = Omit<UserDto, 'email' | 'isActivate'>;
